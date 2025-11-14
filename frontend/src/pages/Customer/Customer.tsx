import { Navigate } from "react-router";

import { useCustomers } from "../../hooks/useCustomers";
import { useAuth } from "../../hooks/useAuth";

import { Table, type Column } from "../../components/table/Table";
import ButtonIcon from "../../components/ui/ButtonIcon";
import Text from "../../components/ui/Text";

import { getInitials } from "../../utils/getInitials";
import type { Customer } from "../../types/customer";

import PenLine from "../../assets/icons/pen-line.svg?react";
import Trash from "../../assets/icons/trash.svg?react";

export function Customer() {
  const { user } = useAuth();
  if (user?.role !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  const { customers, loading } = useCustomers();
  const handleEditCustomer = () => alert("Abre modal Edit");
  const handleDeleteCustomer = () => alert("Abre modal delete");

  const columns: Column<Customer>[] = [
    {
      header: "Nome",
      accessor: (customer) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center p-[10px] max-w-6  max-h-6 rounded-full bg-blue-dark">
            <Text variant="text-xxs" className="text-gray-600">
              {getInitials(customer.name)}
            </Text>
          </div>
          <Text variant="text-sm-bold" className="text-gray-200">
            {customer.name}
          </Text>
        </div>
      ),
    },
    {
      header: "E-mail",
      accessor: (customer) => (
        <Text variant="text-sm-regular" className="text-gray-200">
          {customer.email}
        </Text>
      ),
    },
    {
      header: "",
      accessor: () => (
        <div className="flex gap-1">
          <ButtonIcon
            icon={Trash}
            variant="danger"
            size="sm"
            onClick={handleDeleteCustomer}
          />
          <ButtonIcon
            icon={PenLine}
            variant="secondary"
            size="sm"
            onClick={handleEditCustomer}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Text variant="text-xl" className="text-blue-dark">
        Clientes
      </Text>

      <Table
        data={customers}
        columns={columns}
        loading={loading}
        emptyMessage="Nenhum cliente encontrado"
      />
    </div>
  );
}
