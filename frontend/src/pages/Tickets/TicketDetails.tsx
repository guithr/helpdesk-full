import { useParams, useNavigate } from "react-router-dom";
import { useTicketDetails } from "../../hooks/useTicketDetails";
import { formatDate } from "../../utils/formatDate";
import Text from "../../components/ui/Text";
import { formatId } from "../../utils/formatId";
import Icon from "../../components/icon/Icon";
import ArrowLeft from "../../assets/icons/arrow-left.svg?react";
import { TagStatus } from "../../components/ui/TagStatus";
import { getInitials } from "../../utils/getInitials";
import { formatCurrency } from "../../utils/formatCurrency";
import Divider from "../../components/ui/Divider";

export function TicketDetails() {
  const navigate = useNavigate();
  const { ticketId } = useParams<{ ticketId: string }>();
  const { ticket, loading, error } = useTicketDetails(ticketId);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar chamado</div>;
  if (!ticket) return <div>Chamado não encontrado</div>;

  return (
    <div className="mx-auto max-w-[800px]">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex flex-col">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <Icon size="sm" svg={ArrowLeft} className="fill-gray-300" />
            <Text variant="text-xs-bold" className="text-gray-300">
              Voltar
            </Text>
          </div>
          <Text variant="text-xl" className="text-blue-dark">
            Chamado Detalhado
          </Text>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="p-8 flex flex-col gap-5 border border-gray-500 rounded-[10px] w-full md:max-w-[480px] flex-shrink-0">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Text variant="text-xs-bold" className="text-gray-300">
                {formatId(ticket.id)}
              </Text>
              <TagStatus status={ticket.status} />
            </div>
            <Text variant="text-md-bold" className="text-gray-200">
              {ticket.title}
            </Text>
          </div>
          <div className="flex flex-col">
            <Text variant="text-xs-bold" className="text-gray-400">
              Descrição
            </Text>
            <Text variant="text-sm-regular" className="text-gray-200">
              {ticket.description}
            </Text>
          </div>
          <div className="flex flex-col">
            <Text variant="text-xs-bold" className="text-gray-400">
              Categoria
            </Text>
            <Text variant="text-sm-regular" className="text-gray-200">
              Serviço
            </Text>
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col">
              <Text variant="text-xs-bold" className="text-gray-400">
                Criado em
              </Text>
              <Text variant="text-sm-regular" className="text-gray-200">
                {formatDate(ticket.createdAt)}
              </Text>
            </div>
            <div className="flex flex-col">
              <Text variant="text-xs-bold" className="text-gray-400">
                Categoria
              </Text>
              <Text variant="text-sm-regular" className="text-gray-200">
                {formatDate(ticket.updatedAt)}
              </Text>
            </div>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-6 border border-gray-500 rounded-[10px] w-full md:max-w-74 flex-1">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 justify-center">
              <Text variant="text-xs-bold" className="text-gray-400">
                Técnico responsável
              </Text>
              <div className="flex gap-2">
                <div className="size-10 md:size-8 flex items-center justify-center rounded-full bg-blue-dark">
                  <Text variant="text-sm-regular" className="text-gray-600">
                    {getInitials(ticket.technician.user.name)}
                  </Text>
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <Text
                    variant="text-sm-regular"
                    className="text-gray-200 truncate"
                  >
                    {ticket.technician.user.name}
                  </Text>
                  <Text
                    variant="text-xs-regular"
                    className="text-gray-300 truncate"
                  >
                    {ticket.technician.user.email}
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-xs-bold" className="text-gray-400">
              Valores
            </Text>
            <div className="flex justify-between">
              <Text variant="text-xs-regular" className="text-gray-200">
                Preço base
              </Text>
              <Text variant="text-xs-regular" className="text-gray-200">
                {formatCurrency(ticket.totalPrice)}
              </Text>
            </div>
          </div>
          <Divider />
          <div className="flex justify-between">
            <Text variant="text-sm-bold" className="text-gray-200">
              Total
            </Text>
            <Text variant="text-sm-bold" className="text-gray-200">
              {formatCurrency(ticket.totalPrice)}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
