import { Router } from "express";

import { authRoutes } from "./auth-routes";
import { adminRoutes } from "./admin-routes";
import { technicianRoutes } from "./technician-routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/admin", adminRoutes);
routes.use("/technician", technicianRoutes);

export { routes };
