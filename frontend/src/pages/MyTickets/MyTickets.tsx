import { Navigate } from "react-router";
import Text from "../../components/ui/Text";
import { useAuth } from "../../hooks/useAuth";
export function MyTickets() {
  const { user } = useAuth();

  if (user?.role !== "TECHNICIAN" && user?.role !== "CUSTOMER") {
    return <Navigate to="/unauthorized" replace />;
  }
  return (
    <Text variant="text-xl" className="text-blue-dark">
      Meus Chamados
    </Text>
  );
}
