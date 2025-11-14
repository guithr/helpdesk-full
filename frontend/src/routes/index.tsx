import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { AuthRoutes } from "./auth-routes";
import { AuthProvider } from "../context/AuthContext";

import { ProtectedRoute } from "./protected-route";

import { Tickets } from "../pages/Dashboard/Tickets";
import { Technicians } from "../pages/Technicians/Technicians";
import { Customer } from "../pages/Customer/Customer";
import { Services } from "../pages/Services/Services";
import { MyTickets } from "../pages/MyTickets/MyTickets";
import { NewTicket } from "../pages/NewTicket/NewTicket";
import { Unauthorized } from "../pages/Unauthorized/Unauthorized";
import { NotFound } from "../pages/NotFound/NotFound";

export function Routes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouterRoutes>
          {/* Rotas de acesso restrito (usuário autenticado) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/clients" element={<Customer />} />
            <Route path="/services" element={<Services />} />
            <Route path="/new-ticketss" element={<NewTicket />} />
          </Route>
          {/* Rotas públicas (login, cadastro, etc) */}
          {AuthRoutes()}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </AuthProvider>
    </BrowserRouter>
  );
}
