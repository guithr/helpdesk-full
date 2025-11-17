import { Navigate } from "react-router";
import Text from "../../components/ui/Text";
import { useAuth } from "../../hooks/useAuth";
import { TicketCard } from "../../components/ticket/TicketCard";
import { useTickets } from "../../hooks/useTickets";
import Button from "../../components/ui/Button";
import { TagStatus } from "../../components/ui/TagStatus";
export function MyTickets() {
  const { user } = useAuth();

  if (user?.role !== "TECHNICIAN" && user?.role !== "CUSTOMER") {
    return <Navigate to="/unauthorized" replace />;
  }

  const { tickets, loading, error, refetch } = useTickets({
    filterBy: "assigned",
  });

  const statusGroups = [
    {
      status: "IN_PROGRESS" as const,
      tickets: tickets.filter((t) => t.status === "IN_PROGRESS"),
    },
    {
      status: "OPEN" as const,
      tickets: tickets.filter((t) => t.status === "OPEN"),
    },
    {
      status: "CLOSED" as const,
      tickets: tickets.filter((t) => t.status === "CLOSED"),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Text variant="text-xl" className="text-blue-dark">
          Meus Chamados
        </Text>
        <Button onClick={refetch} disabled={loading}>
          {loading ? "Carregando..." : "Atualizar"}
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        {statusGroups.map(({ tickets, status }) => (
          <div className="space-y-4">
            <TagStatus status={status} />
            <div className="flex flex-wrap gap-4">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
