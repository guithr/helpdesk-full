import { Router } from "express";
import { TechnicianController } from "@/controllers/TechnicianController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureAuthorized } from "@/middlewares/ensureAuthorized";

const technicianRoutes = Router();
const technicianController = new TechnicianController();

technicianRoutes.use(ensureAuthenticated, ensureAuthorized("TECHNICIAN"));

//  Obter perfil do técnico
technicianRoutes.get("/profile", technicianController.getProfile);

//  Atualizar nome/email do técnico
technicianRoutes.patch("/profile", technicianController.updateProfileSchema);

//  Atualizar nome/email do técnico
technicianRoutes.patch(
  "/profile/password",
  technicianController.changePassword
);

export { technicianRoutes };
