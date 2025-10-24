import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { z } from "zod";
import { prisma } from "@/database/prismaClient";
import { AppError } from "@/errors/AppError";

class CustomerController {
  async getProfile(request: Request, response: Response) {
    const userId = request.user.id;

    const customer = await prisma.customer.findUnique({
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

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404);
    }

    return response.status(200).json(customer);
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
      throw new AppError("Cliente não encontrado", 404);
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
  async changePassword(request: Request, response: Response) {
    const userId = request.user.id;

    const schema = z.object({
      currentPassword: z.string().min(1, "Senha atual é obrigatória"),
      newPassword: z
        .string()
        .min(8, "Nova senha deve ter no mínimo 8 caracteres"),
    });

    const { currentPassword, newPassword } = schema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    const passwordMath = await compare(currentPassword, user.password);

    if (!passwordMath) {
      throw new AppError("Senha atual incorreta", 401);
    }

    const samePassword = await compare(newPassword, user.password);

    if (samePassword) {
      throw new AppError("A nova senha deve ser diferente da senha atual", 400);
    }

    const hashedPassword = await hash(newPassword, 8);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return response.status(200).json({
      message: "Senha alterada com sucesso",
    });
  }
}
export { CustomerController };
