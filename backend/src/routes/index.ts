import { Router } from "express";

import { authRoutes } from "./auth-routes";
import { adminRoutes } from "./admin-routes";

const routes = Router();

//Public Routes
routes.use("/auth", authRoutes);

// Private Routes
routes.use("/admin", adminRoutes);

export { routes };
