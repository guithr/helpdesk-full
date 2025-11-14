import { useState, useEffect } from "react";
import api from "../services/api";
import type { Customer } from "../types/customer";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCustomers() {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/admin/customer");

      setCustomers(response.data.customers);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao carregar técnicos";
      setError(errorMessage);
      console.error("Erro ao buscar técnicos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, loading, error, refetch: fetchCustomers };
}
