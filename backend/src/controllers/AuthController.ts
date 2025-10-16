import { prisma } from "@/database/prismaClient";
import { AppError } from "@/errors/AppError";
import { Request, Response } from "express";
import { authConfig } from "@/config/auth";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { z } from "zod";

class AuthController {
  async login(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      throw new AppError("E-mail ou senha inválido", 401);
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new AppError("E-mail ou senha inválido", 401);
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
