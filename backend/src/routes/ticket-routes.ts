import { Router } from "express";
import { TicketController } from "@/controllers/TicketController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureAuthorized } from "@/middlewares/ensureAuthorized";

const ticketRoutes = Router();
const ticketController = new TicketController();

ticketRoutes.use(ensureAuthenticated);

ticketRoutes.post(
  "",
  ensureAuthorized("CUSTOMER"),
  ticketController.createTicket
);

ticketRoutes.get(
  "",
  ensureAuthorized("CUSTOMER"),
  ticketController.getTicketsByCustomer
);

ticketRoutes.get(
  "/my-tickets",
  ensureAuthorized("TECHNICIAN", "CUSTOMER"),
  ticketController.getMyTickets
);

ticketRoutes.get(
  "/all",
  ensureAuthorized("ADMIN"),
  ticketController.getAllTicket
);

ticketRoutes.get(
  "/:id/details",
  ensureAuthorized("ADMIN", "TECHNICIAN", "CUSTOMER"),
  ticketController.ticketDetails
);

ticketRoutes.patch(
  "/:id/status",
  ensureAuthorized("ADMIN", "TECHNICIAN"),
  ticketController.updateStatus
);

ticketRoutes.post(
  "/add-service",
  ensureAuthorized("TECHNICIAN"),
  ticketController.addServiceByTechnician
);

export { ticketRoutes };
