// src/routes/index.tsx
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { AuthRoutes } from "./auth-routes";
import { ProtectedRoute } from "./protected-route";
import { AuthProvider } from "../context/AuthContext";

import { Ticket } from "../pages/Dashboard/Ticket";
import { PageComponents } from "../pages/Componentes";
import { NotFound } from "../pages/NotFound/NotFound";
import { Unauthorized } from "../pages/Unauthorized/Unauthorized";

export function Routes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouterRoutes>
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

          {/* Rotas públicas (login, cadastro, etc) */}
          {AuthRoutes()}
          <Route path="/components" element={<PageComponents />} />

          {/* Página de acesso negado */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </AuthProvider>
    </BrowserRouter>
  );
}
