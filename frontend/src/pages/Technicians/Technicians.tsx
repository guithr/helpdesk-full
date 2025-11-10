import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router";

import Text from "../../components/ui/Text";

export function Technicians() {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }
  return (
    <Text variant="text-xl" className="text-blue-dark">
      Técnicos
    </Text>
  );
}
