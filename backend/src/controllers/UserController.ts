import { prisma } from "@/database/prismaClient";
import { AppError } from "@/errors/AppError";
import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { z } from "zod";

export class UserController {
  async updateProfile(request: Request, response: Response) {
    const userId = request.user.id;

    const schema = z.object({
      name: z.string().min(2).optional(),
      email: z.string().email().optional(),
    });

    const { name, email } = schema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("Usuário não encontrado", 404);

    if (email && email !== user.email) {
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) throw new AppError("E-mail já está em uso", 409);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
      select: { id: true, name: true, email: true, updatedAt: true },
    });

    return response.status(200).json({
      message: "Perfil atualizado com sucesso",
      user: updated,
    });
  }

  async changePassword(request: Request, response: Response) {
    const userId = request.user.id;

    const schema = z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6),
    });

    const { currentPassword, newPassword } = schema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("Usuário não encontrado", 404);

    const valid = await compare(currentPassword, user.password);
    if (!valid) throw new AppError("Senha atual incorreta", 401);

    const hashed = await hash(newPassword, 8);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return response.status(200).json({ message: "Senha alterada com sucesso" });
  }
}
