import { AppError } from "@/errors/AppError";
import { ErrorRequestHandler } from "express";
import { ZodError, z } from "zod";

export const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next
) => {
  // Erros esperados (AppError)
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  // Erros de validação do Zod
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "validation error",
      issues: z.treeifyError(error),
    });
  }

  return response.status(500).json({ message: error.message });
};
