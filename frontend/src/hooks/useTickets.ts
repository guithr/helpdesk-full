import { useState, useEffect } from "react";
import api from "../services/api";
import type { Ticket } from "../types/ticket";

interface UseTicketsReturn {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseTicketsOptions {
  filterBy?: "all" | "mine" | "assigned";
}

export function useTickets(options: UseTicketsOptions): UseTicketsReturn {
  const { filterBy = "all" } = options;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTickets() {
    try {
      setLoading(true);
      setError(null);

      let endpoint = "/tickets/all";

      if (filterBy === "mine") {
        endpoint = "/tickets/my-tickets";
      } else if (filterBy === "assigned") {
        endpoint = "tickets/assigned-to-me";
      }

      const response = await api.get(endpoint);

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
  }, [filterBy]);

  return {
    tickets,
    loading,
    error,
    refetch: fetchTickets,
  };
}
