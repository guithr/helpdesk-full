import { useState } from "react";
import api from "../services/api";
import type { Ticket, CreateTicketInput } from "../types/ticket";

interface UseCreateTicketReturn {
  createTicket: (data: CreateTicketInput) => Promise<Ticket>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export function useCreateTicket(): UseCreateTicketReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function createTicket(data: CreateTicketInput): Promise<Ticket> {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await api.post<Ticket>("/tickets", data);
      setSuccess(true);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao criar chamado";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setError(null);
    setSuccess(false);
  }

  return {
    createTicket,
    loading,
    error,
    success,
    reset,
  };
}
