// src/routes/index.tsx
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { AuthRoutes } from "./auth-routes";
import { ProtectedRoute } from "./protected-route";
import { AdminRoutes } from "./admin-routes";

import Unauthorized from "../pages/Unauthorized/Unauthorized";
import { Ticket } from "../pages/Dashboard/Ticket";
import { AuthProvider } from "../context/AuthContext";
import { NotFound } from "../pages/Auth/NotFound/NotFound";

export function Routes() {
  return (
    <BrowserRouter>
      {/* Envolvemos o AuthProvider dentro do Router */}
      <AuthProvider>
        <RouterRoutes>
          {/* Rotas públicas (login, cadastro, etc) */}
          <Route path="/*" element={<AuthRoutes />} />

          {/* Rotas de acesso restrito (usuário autenticado) */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "TECHNICIAN", "CUSTOMER"]}
              />
            }
          >
            <Route path="/ticket" element={<Ticket />} />
          </Route>

          {/* Rotas exclusivas do ADMIN */}
          <Route path="/*" element={<AdminRoutes />} />

          {/* Página de acesso negado */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </AuthProvider>
    </BrowserRouter>
  );
}
