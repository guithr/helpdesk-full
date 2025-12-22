import { useState, useEffect } from "react";
import api from "../services/api";
import type { Ticket } from "../types/ticket";

export function useTicketDetails(ticketId?: string) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    api
      .get(`/tickets/${ticketId}/details`)
      .then((response) => {
        setTicket(response.data.ticket);
      })
      .catch((err) => {
        setError("Erro ao carregar chamado");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ticketId]);

  return { ticket, loading, error };
}
