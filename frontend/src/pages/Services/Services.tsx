import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router";

import Text from "../../components/ui/Text";

export function Services() {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }
  return (
    <Text variant="text-xl" className="text-blue-dark">
      Serviços
    </Text>
  );
}
