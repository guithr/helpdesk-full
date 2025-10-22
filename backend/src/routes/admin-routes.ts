import { Router } from "express";
import { AdminController } from "@/controllers/AdminController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureAuthorized } from "@/middlewares/ensureAuthorized";

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.use(ensureAuthenticated, ensureAuthorized("ADMIN"));

adminRoutes.post("/", adminController.createAdmin);
adminRoutes.get("/", adminController.listAdmin);
adminRoutes.put("/:id", adminController.updateAdmin);
adminRoutes.delete("/:id", adminController.deleteAdmin);

export { adminRoutes };
