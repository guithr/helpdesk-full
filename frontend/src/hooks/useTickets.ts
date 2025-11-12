import { useState, useEffect } from "react";
import api from "../services/api";
import type { Ticket } from "../types/ticket";

interface UseTicketsReturn {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTickets(): UseTicketsReturn {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTickets() {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/tickets/all");

      setTickets(response.data.tickets);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao carregar tickets";
      setError(errorMessage);
      console.error("Erro ao buscar tickets:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
  };
}
