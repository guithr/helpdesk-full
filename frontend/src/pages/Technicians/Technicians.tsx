import { Table, type Column } from "../../components/table/Table";
import { useTechnicians } from "../../hooks/useTechnician";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router";

import ButtonIcon from "../../components/ui/ButtonIcon";
import TagTime from "../../components/ui/TagTime";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

import type { Technician } from "../../types/technician";
import { getInitials } from "../../utils/getInitials";

import PenLine from "../../assets/icons/pen-line.svg?react";
import Plus from "../../assets/icons/plus.svg?react";

export function Technicians() {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  const { technicians, loading, error, refetch } = useTechnicians();
  console.log(technicians);
  const handleTechnicianClick = (technician: Technician) => {
    console.log("Técnico clicado:", technician);
    alert("Perfil de técnico");
  };

  const handleNewTechnician = () => alert("Novo tecnico");

  const columns: Column<Technician>[] = [
    {
      header: "Nome",
      accessor: (technician) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center p-[10px] max-w-6  max-h-6 rounded-full bg-blue-dark">
            <Text variant="text-xxs" className="text-gray-600">
              {getInitials(technician.name)}
            </Text>
          </div>
          <Text variant="text-sm-bold" className="text-gray-200">
            {technician.name}
          </Text>
        </div>
      ),
    },
    {
      header: "E-mail",
      accessor: (technician) => (
        <Text variant="text-sm-regular" className="text-gray-200">
          {technician.email}
        </Text>
      ),
    },
    {
      header: "Disponibilidade",
      accessor: (technician) => (
        <div className="flex flex-wrap gap-1">
          {technician.technician?.availableHours
            ?.slice(0, 4)
            .map((hour, index) => (
              <TagTime state="readonly" key={index}>
                {hour}
              </TagTime>
            ))}
          {(technician.technician?.availableHours?.length || 0) > 4 && (
            <TagTime state="readonly" key="remaining">
              +{(technician.technician?.availableHours?.length || 0) - 4}
            </TagTime>
          )}
        </div>
      ),
    },
    {
      header: "",
      accessor: () => (
        <ButtonIcon icon={PenLine} variant="secondary" size="sm" />
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <Text variant="text-xl" className="text-blue-dark">
          Técnicos
        </Text>
        <Button
          icon={Plus}
          variant="primary"
          onClick={handleNewTechnician}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Novo"}
        </Button>
      </div>

      <Table
        data={technicians}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum técnico encontrado"
        onRowClick={handleTechnicianClick}
      />
    </div>
  );
}
