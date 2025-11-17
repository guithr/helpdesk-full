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
  "/assigned-to-me",
  ensureAuthorized("TECHNICIAN"),
  ticketController.getMyTickets
);

ticketRoutes.get(
  "/all",
  ensureAuthorized("ADMIN"),
  ticketController.getAllTicket
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
