import { Request, Response, NextFunction } from "express";
import { AppError } from "@/errors/AppError";

export function ensureAuthorized(...allowedRoles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const { role } = request.user;

    if (!allowedRoles.includes(role)) {
      throw new AppError("Acesso não autorizado", 403);
    }
    return next();
  };
}
