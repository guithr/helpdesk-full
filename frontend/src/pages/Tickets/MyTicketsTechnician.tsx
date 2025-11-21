import { useTickets } from "../../hooks/useTickets";

import { TicketCard } from "../../components/ticket/TicketCard";
import { TagStatus } from "../../components/ui/TagStatus";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

export function MyTicketsTechnician() {
  const { tickets, loading, error, refetch } = useTickets({
    filterBy: "mine",
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

  if (error) {
    return (
      <div>
        <div>{error}</div>
        <Button onClick={refetch}>Tentar novamente</Button>
      </div>
    );
  }

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
