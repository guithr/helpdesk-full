import { prisma } from "@/database/prismaClient";
import { AppError } from "@/errors/AppError";
import { Request, Response } from "express";
import { authConfig } from "@/config/auth";
import { sign } from "jsonwebtoken";
import { compare, hash } from "bcrypt";
import { z } from "zod";

class AuthController {
  async register(request: Request, response: Response) {
    const schema = z.object({
      name: z.string().trim().min(2, { message: "Nome é obrigatório" }),
      email: z.email({ message: "E-mail inválido" }).trim().toLowerCase(),
      password: z
        .string()
        .min(6, { message: "A senha deve ter pelo menos 6 dígitos" }),
    });

    const { name, email, password } = schema.parse(request.body);

    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userExist) {
      throw new AppError("E-mail já cadastrado", 409);
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CUSTOMER",
        customer: { create: {} },
      },
    });

    // const customer = await prisma.customer.create({
    //   data: {
    //     userId: user.id,
    //   },
    //   include: { user: true },
    // });

    return response.status(201).json({
      message: "Conta criada com sucesso",
      user: { id: user.id, name: user.name, email: user.email },
    });
  }

  async login(request: Request, response: Response) {
    const schema = z.object({
      email: z.email(),
      password: z.string().min(1),
    });

    const { email, password } = schema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new AppError("Credenciais inválidas", 401);
    }

    if (!user.isActive) {
      throw new AppError("Conta desativada", 403);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;

    response.json({ token, user: userWithoutPassword });
  }
}

export { AuthController };
