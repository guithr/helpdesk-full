import { Request, Response, NextFunction } from "express";
import { AppError } from "@/errors/AppError";
import { authConfig } from "@/config/auth";
import { verify } from "jsonwebtoken";

interface TokenPayLoad {
  role: string;
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token JWT não informado", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.jwt.secret) as TokenPayLoad;

    request.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch {
    throw new AppError("Token inválido ou expirado", 401);
  }
}
