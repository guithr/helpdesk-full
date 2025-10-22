import { Request, Response } from "express";
import { prisma } from "@/database/prismaClient";
import { AppError } from "@/errors/AppError";
import { z } from "zod";
import { hash } from "bcrypt";

export class AdminController {
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
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    response.status(201).json({
      message: "Administrador criado com sucesso",
      admin,
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
        createdAt: true,
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
}
