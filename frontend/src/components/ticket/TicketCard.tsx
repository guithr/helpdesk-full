import Button from "../ui/Button";
import ButtonIcon from "../ui/ButtonIcon";
import Text from "../ui/Text";
import PenLine from "../../assets/icons/pen-line.svg?react";
import Check from "../../assets/icons/circle-check-big.svg?react";
import Clock from "../../assets/icons/clock-2.svg?react";
import { getInitials } from "../../utils/getInitials";
import { TagStatus } from "../ui/TagStatus";
import type { Ticket } from "../../types/ticket";
import { formatId } from "../../utils/formatId";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  const openModal = () => {
    alert("openModal");
  };
  const renderActionButton = () => {
    if (ticket.status === "OPEN") {
      return (
        <Button
          size="sm"
          icon={Clock}
          onClick={(e) => {
            e.stopPropagation();
            openModal();
          }}
        >
          Iniciar
        </Button>
      );
    }
    if (ticket.status === "IN_PROGRESS") {
      return (
        <Button
          size="sm"
          icon={Check}
          onClick={(e) => {
            e.stopPropagation(); // 👈 CRÍTICO
            openModal();
          }}
        >
          Encerrar
        </Button>
      );
    }

    return;
  };
  return (
    <div
      className="p-5 w-[346px] rounded-[10px] border border-gray-500"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <Text variant="text-xs-bold" className="text-gray-400">
          {formatId(ticket.id)}
        </Text>

        <div className="flex gap-1">
          <ButtonIcon size="sm" variant="secondary" icon={PenLine} />
          {renderActionButton()}
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <Text variant="text-md-bold" className="text-gray-200">
          {ticket.title}
        </Text>
        <Text
          variant="text-xs-regular"
          className="text-gray-200 overflow-hidden line-clamp-1"
        >
          {ticket.description}
        </Text>
      </div>
      <div className="flex justify-between items-center  mb-4">
        <Text variant="text-xs-regular" className="text-gray-200">
          {/* {formatDate()} */}
          {formatDate(ticket.updatedAt)}
        </Text>
        <Text variant="text-sm-regular" className="text-gray-200">
          {formatCurrency(ticket.totalPrice)}
        </Text>
      </div>
      <div className="mb-4 md:border-b-gray-500 md:border-b"></div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="flex items-center justify-center p-[10px] max-w-6  max-h-6 rounded-full bg-blue-dark">
            <Text variant="text-xxs" className="text-gray-600">
              {getInitials(ticket.customer.user.name)}
            </Text>
          </div>
          <Text variant="text-sm-bold" className="text-gray-200">
            {ticket.customer.user.name}
          </Text>
        </div>
        <TagStatus showLabel={false} status={ticket.status} />
      </div>
    </div>
  );
}
