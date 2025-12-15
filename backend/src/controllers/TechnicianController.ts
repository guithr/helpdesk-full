import { prisma } from "@/database/prismaClient";
import { AppError } from "@/errors/AppError";
import { Request, Response } from "express";
import { z } from "zod";

export class TechnicianController {
  async getProfile(request: Request, response: Response) {
    const userId = request.user.id;

    const technician = await prisma.technician.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            isActive: true,
          },
        },
      },
    });

    if (!technician) {
      throw new AppError("Técnico não encontrado", 404);
    }

    return response.status(200).json(technician);
  }
  async updateProfileSchema(request: Request, response: Response) {
    const userId = request.user.id;

    const schema = z.object({
      name: z.string().trim().min(2).optional(),
      email: z.email().trim().optional(),
    });

    const { name, email } = schema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError("Técnico não encontrado", 404);
    }

    if (email && email !== user.email) {
      const emailExist = await prisma.user.findUnique({ where: { email } });
      if (emailExist) {
        throw new AppError("Este e-mail já está em uso", 409);
      }
    }

    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name ?? user.name,
        email: email ?? user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
      },
    });

    return response.status(200).json({
      mssage: "Perfil atualizado com sucesso",
      user: updateUser,
    });
  }
}
