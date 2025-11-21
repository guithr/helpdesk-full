import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { MyTicketsCustomer } from "./MyTicketsCustomer";
import { MyTicketsTechnician } from "./MyTicketsTechnician";
export function MyTickets() {
  const { user } = useAuth();

  if (user?.role === "CUSTOMER") {
    return <MyTicketsCustomer />;
  }
  if (user?.role === "TECHNICIAN") {
    return <MyTicketsTechnician />;
  }

  return <Navigate to="/unauthorized" replace />;
}
