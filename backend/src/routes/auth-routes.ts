import { Router } from "express";
import { AuthController } from "@/controllers/AuthController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureAuthorized } from "@/middlewares/ensureAuthorized";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/login", authController.login);

// rota protegida de teste
authRoutes.get("/me", ensureAuthenticated, (req, res) => {
  return res.json({
    message: "Token válido ✅",
    user: req.user,
  });
});

authRoutes.post(
  "/create-technician",
  ensureAuthenticated,
  ensureAuthorized("ADMIN"),
  (req, res) => {
    res.json({ message: "Técnico criado com sucesso" });
  }
);
export { authRoutes };
