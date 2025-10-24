import { Router } from "express";
import { AdminController } from "@/controllers/AdminController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureAuthorized } from "@/middlewares/ensureAuthorized";

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.use(ensureAuthenticated, ensureAuthorized("ADMIN"));

// Admin
adminRoutes.post("/users", adminController.createAdmin);
adminRoutes.get("/users", adminController.listAdmin);
adminRoutes.put("/users/:id", adminController.updateAdmin);
adminRoutes.delete("/users/:id", adminController.deleteAdmin);

// Technician
adminRoutes.post("/technicians", adminController.createTechnicians);
adminRoutes.get("/technicians", adminController.listTechnicians);
adminRoutes.patch("/technicians/:id", adminController.updateTechnicians);

// Customer
adminRoutes.get("/customer", adminController.listCustomer);
adminRoutes.patch("/customer/:id", adminController.updateCustomer);

export { adminRoutes };
