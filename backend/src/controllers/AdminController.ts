import { Request, Response } from "express";
import { prisma } from "@/database/prismaClient";
import { AppError } from "@/errors/AppError";
import { z } from "zod";
import { hash } from "bcrypt";

export class AdminController {
  // Admin
  async createAdmin(request: Request, response: Response) {
    const schema = z.object({
      name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
      email: z.email({ message: "E-mail inválido" }).trim().toLowerCase(),
      password: z
        .string()
        .min(8, { message: "A senha deve ter pelo menos 8 dígitos" }),
    });

    const { name, email, password } = schema.parse(request.body);

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new AppError("E-mail já cadastrado", 409);
    }

    const hashedPassword = await hash(password, 8);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    const { password: _, ...userWithoutPassword } = admin;

    response.status(201).json({
      message: "Administrador criado com sucesso",
      admin: userWithoutPassword,
    });
  }
  async listAdmin(request: Request, response: Response) {
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return response.status(200).json({ total: admins.length, admins });
  }
  async updateAdmin(request: Request, response: Response) {
    const schema = z.object({
      name: z.string().trim().min(2).optional(),
      email: z.email().trim().toLowerCase().optional(),
    });

    const { name, email } = schema.parse(request.body);
    const { id } = request.params;

    const admin = await prisma.user.findUnique({
      where: {
        id,
        role: "ADMIN",
      },
    });

    if (!admin) {
      throw new AppError("Admin não encontrado", 404);
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail && existingEmail.id !== id) {
      throw new AppError("E-mail já está em uso por outro usuário", 409);
    }

    const updateAdmin = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
      },
    });

    return response.status(200).json({
      message: "Dados alterados com sucesso!",
      updateAdmin,
    });
  }
  async deleteAdmin(request: Request, response: Response) {
    const { id } = request.params;

    const admin = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!admin) {
      throw new AppError("Administrador não encontrado", 404);
    }

    if (admin.role !== "ADMIN") {
      throw new AppError("Usuário não é um administrador", 403);
    }

    if (!admin.isActive) {
      throw new AppError("Usuário já está desativado", 400);
    }

    if (request.user.id === id) {
      throw new AppError("Você não pode desativar sua própria conta", 403);
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

    return response.status(200).json({
      message: "Administrador desativado com sucesso",
    });
  }

  // Technician
  async createTechnicians(request: Request, response: Response) {
    const schema = z.object({
      name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
      email: z.email({ message: "E-mail inválido" }).trim().toLowerCase(),
      password: z
        .string()
        .min(8, { message: "A senha deve ter pelo menos 8 dígitos" }),
      availableHours: z.array(z.string()).optional(),
    });
    const { name, email, password, availableHours } = schema.parse(
      request.body
    );

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new AppError("E-mail já cadastrado", 409);
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "TECHNICIAN",
        technician: {
          create: {
            availableHours: availableHours || [
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
          },
        },
      },
      include: { technician: true },
    });

    return response.status(200).json({
      message: "Técnico criado com sucesso",
    });
  }

  async listTechnicians(request: Request, response: Response) {
    const technician = await prisma.user.findMany({
      where: {
        role: "TECHNICIAN",
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return response.status(200).json({ total: technician.length, technician });
  }

  async updateTechnicians(request: Request, response: Response) {
    const schema = z.object({
      name: z.string().trim().optional(),
      email: z.email().trim().toLowerCase().optional(),
      availableHours: z
        .array(z.string())
        .min(1, { message: "Horários obrigatórios" })
        .optional(),
    });

    const { name, email, availableHours } = schema.parse(request.body);
    const { id } = request.params;

    const technician = await prisma.technician.findUnique({
      where: { userId: id },
      include: { user: true },
    });

    if (!technician) {
      throw new AppError("Técnico não encontrado", 404);
    }

    if (technician.user.role !== "TECHNICIAN") {
      throw new AppError("Usuário não é um técnico válido", 403);
    }

    const updatedUser = await prisma.user.update({
      where: { id: technician.userId },
      data: {
        name: name ?? technician.user.name,
        email: email ?? technician.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        updatedAt: true,
      },
    });

    const updatedTechnician = await prisma.technician.update({
      where: { userId: id },
      data: {
        availableHours: availableHours ?? technician.availableHours,
      },
      include: { user: true },
    });

    return response.status(200).json({
      message: "Técnico atualizado com sucesso",
      technician: {
        id: updatedTechnician.id,
        availableHours: updatedTechnician.availableHours,
        user: updatedUser,
      },
    });
  }

  //Customer
  async listCustomer(request: Request, response: Response) {
    const user = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return response.status(200).json({ total: user.length, user });
  }

  async updateCustomer(request: Request, response: Response) {
    const schema = z.object({
      name: z.string().trim().optional(),
      email: z.email().trim().toLowerCase().optional(),
    });

    const { name, email } = schema.parse(request.body);
    const { id } = request.params;

    const customer = await prisma.customer.findUnique({
      where: { userId: id },
      include: { user: true },
    });

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404);
    }

    if (customer.user.role !== "CUSTOMER") {
      throw new AppError("Usuário não é um cliente", 403);
    }

    const updatedUser = await prisma.user.update({
      where: { id: customer.userId },
      data: {
        name: name ?? customer.user.name,
        email: email ?? customer.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return response.status(200).json({
      message: "Cliente atualizado com sucesso",
      customer: {
        id: customer.id,
        user: updatedUser,
      },
    });
  }
}
