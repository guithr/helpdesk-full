import { Navigate } from "react-router";

import { useServices } from "../../hooks/useServices";
import { useAuth } from "../../hooks/useAuth";

import { Table, type Column } from "../../components/table/Table";
import { TagStatus } from "../../components/ui/TagStatus";
import Text from "../../components/ui/Text";

import { formatCurrency } from "../../utils/formatCurrency";
import type { Service } from "../../types/services";
import ButtonIcon from "../../components/ui/ButtonIcon";

import PenLine from "../../assets/icons/pen-line.svg?react";
import Ban from "../../assets/icons/ban.svg?react";
import Button from "../../components/ui/Button";

export function Services() {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  const { services, loading } = useServices();
  const handleEditService = () => alert("Abre modal service");
  const handleActiveOrNoService = () => alert("Ativa ou reativa");

  const columns: Column<Service>[] = [
    {
      header: "Título",
      accessor: (services) => (
        <Text variant="text-sm-bold" className="text-gray-200">
          {services.name}
        </Text>
      ),
    },
    {
      header: "Valor",
      accessor: (services) => (
        <Text variant="text-sm-regular" className="text-gray-200">
          {formatCurrency(services.price)}
        </Text>
      ),
    },
    {
      header: "Status",
      accessor: (services) => (
        <TagStatus status={services.isActive ? "TRUE" : "FALSE"} />
      ),
    },
    {
      header: "",
      accessor: (services) => (
        <div className="flex gap-1">
          <Button
            icon={Ban}
            variant="link"
            size="sm"
            onClick={handleActiveOrNoService}
          >
            {services.isActive ? "Desativar" : "Reativar"}
          </Button>
          <ButtonIcon
            icon={PenLine}
            variant="secondary"
            size="sm"
            onClick={handleEditService}
          />
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Text variant="text-xl" className="text-blue-dark">
          Serviços
        </Text>
      </div>
      <Table
        data={services}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum serviço encontrado"
      />
    </div>
  );
}
