import { Request, Response } from "express";
import { AppError } from "@/errors/AppError";
import z from "zod";
import { prisma } from "@/database/prismaClient";

export class TicketController {
  // Cliente cria chamado selecionando técnico e serviços
  async createTicket(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z
        .string()
        .trim()
        .min(5, "O título deve ter no mínimo 5 caracteres"),
      description: z.string().trim().optional(),
      service: z
        .array(z.uuid("Serviço inválido"))
        .min(1, "Selecione pelo menos um serviço"),
    });

    const userId = request.user?.id;
    const { title, description, service } = bodySchema.parse(request.body);

    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const customer = await prisma.customer.findUnique({
      where: {
        userId,
      },
    });

    if (!customer) {
      throw new AppError("Apenas clientes podem criar chamados", 403);
    }

    //Busca o técnico Ativo
    //Depois buscar o técnico disponível no horario qual chamado foi criado.
    const availableTechnician = await prisma.technician.findFirst({
      where: {
        user: { isActive: true },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!availableTechnician) {
      throw new AppError("Nenhum técnico disponível no momento", 404);
    }

    const selectedServices = await prisma.service.findMany({
      where: { id: { in: service }, isActive: true },
    });

    if (selectedServices.length === 0) {
      throw new AppError("Nenhum serviço válido foi selecionado", 400);
    }

    // Calcula preço total
    const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

    // Cria o ticket
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        customerId: customer.id,
        technicianId: availableTechnician.id,
        totalPrice,
        ticketServices: {
          create: selectedServices.map((service) => ({
            serviceId: service.id,
            addedBy: "CUSTOMER",
            price: service.price,
          })),
        },
      },
      include: {
        technician: { include: { user: true } },
        ticketServices: { include: { service: true } },
      },
    });

    return response.status(201).json(ticket);
  }

  async getTicketsByCustomer(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    // Verifica se o usuário é um cliente
    const customer = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new AppError("Apenas clientes podem listar chamados", 403);
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        customerId: customer.id,
      },
      include: {
        technician: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        ticketServices: {
          include: {
            service: {
              select: { id: true, name: true, price: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (tickets.length === 0) {
      throw new AppError("Nenhum chamado criado.", 400);
    }

    return response.status(200).json({
      total: tickets.length,
      tickets,
    });
  }

  async getAllTicket(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      throw new AppError(
        "Apenas administradores podem visualizar todos os chamados",
        403
      );
    }

    const tickets = await prisma.ticket.findMany({
      include: {
        customer: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        technician: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        ticketServices: {
          include: {
            service: {
              select: { id: true, name: true, price: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return response.status(200).json({
      total: tickets.length,
      tickets,
    });
  }

  async getMyTickets(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (user.role !== "TECHNICIAN" && user.role !== "CUSTOMER") {
      throw new AppError(
        "Apenas técnicos e clientes podem visualizar seus chamados",
        403
      );
    }

    const whereCondition = await (async () => {
      if (user.role === "TECHNICIAN") {
        const technician = await prisma.technician.findUnique({
          where: { userId },
        });

        if (!technician) {
          throw new AppError("Técnico não encontrado", 404);
        }

        return { technicianId: technician.id };
      }

      // user.role === "CUSTOMER"
      const customer = await prisma.customer.findUnique({
        where: { userId },
      });

      if (!customer) {
        throw new AppError("Cliente não encontrado", 404);
      }

      return { customerId: customer.id };
    })();

    const tickets = await prisma.ticket.findMany({
      where: whereCondition,
      include: {
        customer: {
          include: {
            user: {
              select: { name: true, email: true, avatarUrl: true },
            },
          },
        },
        technician: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        ticketServices: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return response.status(200).json({
      total: tickets.length,
      tickets,
    });
  }
  async updateStatus(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const paramSchema = z.object({
      id: z.uuid("ID do chamado inválido"),
    });

    const bodySchema = z.object({
      status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
    });

    const { id } = paramSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: { role: true },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
      include: {
        technician: { include: { user: true } },
      },
    });

    if (!ticket) {
      throw new AppError("Chamado não encontrado", 404);
    }

    if (user.role !== "ADMIN" && ticket.technician.user.id !== userId) {
      throw new AppError(
        "Você não tem permissão para alterar o status deste chamado",
        403
      );
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        customer: { include: { user: true } },
        technician: { include: { user: true } },
      },
    });
    return response.status(200).json({
      message: `Status do chamado atualizado para ${status}`,
      ticket: updatedTicket,
    });
  }

  async addServiceByTechnician(request: Request, response: Response) {
    const userId = request.user?.id;

    if (!userId) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const bodySchema = z.object({
      ticketId: z.uuid("ID do chamado inválido"),
      serviceId: z.uuid("ID do serviço inválido"),
    });

    const { ticketId, serviceId } = bodySchema.parse(request.body);

    // Busca o usuário autenticado
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (user.role !== "TECHNICIAN") {
      throw new AppError(
        "Apenas técnicos podem adicionar serviços adicionais",
        403
      );
    }

    // Busca o ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { technician: true },
    });

    if (!ticket) {
      throw new AppError("Chamado não encontrado", 404);
    }

    // Verifica se o técnico é o responsável pelo chamado
    if (ticket.technicianId !== ticket.technician.id) {
      throw new AppError(
        "Você não é o técnico responsável por este chamado",
        403
      );
    }

    // Verifica se o chamado está encerrado
    if (ticket.status === "CLOSED") {
      throw new AppError(
        "Não é possível adicionar serviços a um chamado encerrado",
        400
      );
    }

    // Verifica se o serviço existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new AppError("Serviço não encontrado", 404);
    }

    // Verifica se o serviço já foi adicionado antes
    const existing = await prisma.ticketService.findFirst({
      where: {
        ticketId,
        serviceId,
      },
    });

    if (existing) {
      throw new AppError("Este serviço já foi adicionado a este chamado", 400);
    }

    // Cria o novo serviço vinculado ao chamado
    const newTicketService = await prisma.ticketService.create({
      data: {
        ticketId,
        serviceId,
        addedBy: "TECHNICIAN",
        price: service.price,
      },
    });

    // Recalcula o preço total do chamado
    const totalPriceResult = await prisma.ticketService.aggregate({
      where: { ticketId },
      _sum: { price: true },
    });

    const totalPrice = totalPriceResult._sum.price || 0;

    // Atualiza o total do ticket
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { totalPrice },
    });

    return response.status(201).json({
      message: "Serviço adicional adicionado com sucesso",
      ticketService: newTicketService,
      totalPrice,
    });
  }
}
