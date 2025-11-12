export function formatCurrency(value: string | number | null) {
  if (!value) return "R$ 0,00";

  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
}
