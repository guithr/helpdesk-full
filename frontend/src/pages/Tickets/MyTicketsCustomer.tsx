import { useTickets } from "../../hooks/useTickets";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router";

import { useAuth } from "../../hooks/useAuth";

import type { Ticket } from "../../types/ticket";

import { formatCurrency } from "../../utils/formatCurrency";
import { getInitials } from "../../utils/getInitials";
import { formatDate } from "../../utils/formatDate";
import { formatId } from "../../utils/formatId";

import { Table, type Column } from "../../components/table/Table";
import { TagStatus } from "../../components/ui/TagStatus";
import ButtonIcon from "../../components/ui/ButtonIcon";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

import EyeIcon from "../../assets/icons/eye.svg?react";

export function MyTicketsCustomer() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== "CUSTOMER") {
    return <Navigate to="/unauthorized" replace />;
  }
  const { tickets, loading, error, refetch } = useTickets({
    filterBy: "mine",
  });

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
        <Text variant="text-xs-regular" className="text-gray-200 text-wrap">
          {formatDate(ticket.updatedAt)}
        </Text>
      ),
      showOnMobile: true,
    },
    {
      header: "Id",
      accessor: (ticket) => (
        <Text variant="text-xs-bold" className="text-gray-200">
          {formatId(ticket.id)}
        </Text>
      ),
      showOnMobile: false,
    },
    {
      header: "Título",
      accessor: (ticket) => (
        <div className="flex flex-col ">
          <Text
            variant="text-sm-bold"
            className="text-gray-200 max-w-[120px] md:max-w-[175px]
     truncate"
          >
            {ticket.title}
          </Text>
        </div>
      ),
      showOnMobile: true,
    },
    {
      header: "Serviço",
      accessor: (ticket) => (
        <div className="flex flex-col">
          <Text
            variant="text-sm-regular"
            className="text-gray-200  max-w-[175px]
     truncate"
          >
            {getServiceDisplay(ticket)}
          </Text>
        </div>
      ),
      showOnMobile: false, // ← MOSTRAR EM MOBILE
    },
    {
      header: "Valor total",
      accessor: (ticket) => (
        <Text variant="text-sm-regular" className="text-gray-200 ">
          {formatCurrency(ticket.totalPrice)}
        </Text>
      ),
      showOnMobile: false,
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
      showOnMobile: false,
    },
    {
      header: "Status",
      accessor: (ticket) => (
        <>
          {/* Mobile */}
          <div className="md:hidden">
            <TagStatus status={ticket.status} showLabel={false} />
          </div>

          {/* Desktop */}
          <div className="hidden md:block">
            <TagStatus status={ticket.status} />
          </div>
        </>
      ),
    },
    {
      header: "Ações",
      accessor: (ticket) => (
        <ButtonIcon
          onClick={() => navigate(`/tickets-details/${ticket.id}`)}
          icon={EyeIcon}
          variant="secondary"
          size="sm"
        />
      ),
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

      <Table
        data={tickets}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum ticket encontrado"
      />
    </div>
  );
}
