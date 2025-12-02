import { Router } from "express";
import { authRoutes } from "./auth-routes";
import { adminRoutes } from "./admin-routes";
import { technicianRoutes } from "./technician-routes";
import { ticketRoutes } from "./ticket-routes";
import { customerRoutes } from "./customer-routes";
const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/admin", adminRoutes);
routes.use("/technician", technicianRoutes);
routes.use("/customer", customerRoutes);
routes.use("/tickets", ticketRoutes);

export { routes };
