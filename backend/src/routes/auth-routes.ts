import { Router } from "express";
import { AuthController } from "@/controllers/AuthController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/login", authController.login);
authRoutes.post("/register", authController.register);
authRoutes.get("/me", ensureAuthenticated, authController.me);

export { authRoutes };
