import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

import Text from "../../components/ui/Text";

export function NewTicket() {
  const { user } = useAuth();

  if (user?.role !== "ADMIN" && user?.role !== "CUSTOMER") {
    return <Navigate to="/unauthorized" replace />;
  }
  return (
    <Text variant="text-xl" className="text-blue-dark">
      Novo chamado
    </Text>
  );
}
