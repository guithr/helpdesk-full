import { Table, type Column } from "../../components/table/Table";
import { useTickets } from "../../hooks/useTickets";
import type { Ticket } from "../../types/ticket";

import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatId } from "../../utils/formatId";

import Text from "../../components/ui/Text";
import ButtonIcon from "../../components/ui/ButtonIcon";

import PenLine from "../../assets/icons/pen-line.svg?react";
import { getInitials } from "../../utils/getInitials";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router";
import { TagStatus } from "../../components/ui/TagStatus";

export function Tickets() {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }
  const { tickets, loading, error, refetch } = useTickets();

  const handleTicketClick = (ticket: Ticket) => {
    console.log("Ticket clicado:", ticket);
    alert("Ir para tela do chamado detalhado");
  };

  const getServiceDisplay = (ticket: Ticket) => {
    if (!ticket.ticketServices || ticket.ticketServices.length === 0) {
      return "Nenhum serviço adicionado";
    }
    return ticket.ticketServices[0].service.name;
  };

  const columns: Column<Ticket>[] = [
    {
      header: "Atualizado em",
      accessor: (ticket) => (
        <Text variant="text-xs-regular" className="text-gray-200">
          {formatDate(ticket.updatedAt)}
        </Text>
      ),
    },
    {
      header: "Id",
      accessor: (ticket) => (
        <Text variant="text-xs-bold" className="text-gray-200">
          {formatId(ticket.id)}
        </Text>
      ),
    },
    {
      header: "Título e Serviço",
      accessor: (ticket) => (
        <div className="flex flex-col">
          <Text variant="text-sm-bold" className="text-gray-200">
            {ticket.title}
          </Text>
          <Text variant="text-xs-regular" className="text-gray-200">
            {getServiceDisplay(ticket)}
          </Text>
        </div>
      ),
    },
    {
      header: "Valor total",
      accessor: (ticket) => (
        <Text variant="text-sm-regular" className="text-gray-200">
          {formatCurrency(ticket.totalPrice)}
        </Text>
      ),
    },
    {
      header: "Cliente",
      accessor: (ticket) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center p-[10px] max-w-6  max-h-6 rounded-full bg-blue-dark">
            <Text variant="text-xxs" className="text-gray-600">
              {getInitials(ticket.customer.user.name)}
            </Text>
          </div>
          <Text variant="text-sm-regular" className="text-gray-200">
            {ticket.customer.user.name}
          </Text>
        </div>
      ),
    },
    {
      header: "Técnico",
      accessor: (ticket) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center p-[10px] max-w-6  max-h-6 rounded-full bg-blue-dark">
            <Text variant="text-xxs" className="text-gray-600">
              {getInitials(ticket.technician.user.name)}
            </Text>
          </div>
          <Text variant="text-sm-regular" className="text-gray-200">
            {ticket.technician.user.name}
          </Text>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (ticket) => <TagStatus status={ticket.status} />,
    },
    {
      header: "Ações",
      accessor: (ticket) => (
        <ButtonIcon icon={PenLine} variant="secondary" size="sm" />
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-8">
        <div>{error}</div>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-blue-base text-white rounded hover:bg-blue-dark"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Text variant="text-xl" className="text-blue-dark">
          Meus Chamados
        </Text>
        <button
          onClick={refetch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Carregando..." : "Atualizar"}
        </button>
      </div>

      <Table
        data={tickets}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum ticket encontrado"
        onRowClick={handleTicketClick}
      />
    </div>
  );
}
