// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppLayout } from "../components/layouts/AppLayout";

interface ProtectedRouteProps {
  allowedRoles?: Array<"ADMIN" | "TECHNICIAN" | "CUSTOMER">;
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  if (allowedRoles && !allowedRoles.includes(user!.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <AppLayout />;
}
