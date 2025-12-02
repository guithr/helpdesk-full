import { Router } from "express";
import { CustomerController } from "@/controllers/CustomerController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureAuthorized } from "@/middlewares/ensureAuthorized";

const customerRoutes = Router();
const customerController = new CustomerController();

//  Obter perfil do cliente
customerRoutes.get("/profile", customerController.getProfile);

//  Atualizar nome/email do cliente
customerRoutes.patch("/profile", customerController.updateProfileSchema);

// Listar serviços
customerRoutes.get("/services", customerController.listServices);

//  Atualizar senha do cliente
customerRoutes.patch("/profile/password", customerController.changePassword);

export { customerRoutes };
