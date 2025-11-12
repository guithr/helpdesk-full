// src/components/Table/Table.tsx
import { type ReactNode } from "react";
import Text from "../ui/Text";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends { id: string }>({
  data,
  columns,
  loading = false,
  emptyMessage = "Nenhum registro encontrado",
  onRowClick,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        <p className="mt-2 text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500">{emptyMessage}</div>
    );
  }

  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return row[column.accessor] as ReactNode;
  };

  return (
    <div className="w-full border border-gray-500 rounded-xl overflow-hidden">
      <table className="w-full rounded-xl">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="p-3 text-left border-b border-gray-500"
              >
                <Text variant="text-sm-bold" className="text-gray-400">
                  {column.header}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-500">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={`hover:bg-gray-50 transition-colors ${
                onRowClick ? "cursor-pointer" : ""
              }`}
            >
              {columns.map((column, index) => (
                <td key={index} className="px-3 py-6 whitespace-nowrap">
                  {getCellValue(row, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
