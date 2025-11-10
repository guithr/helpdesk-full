import { Navigate } from "react-router";
import Text from "../../components/ui/Text";
import { useAuth } from "../../hooks/useAuth";

export function Tickets() {
  const { user } = useAuth();
  if (user?.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }
  return (
    <Text variant="text-xl" className="text-blue-dark">
      Chamados
    </Text>
  );
}
