import { useState, useEffect } from "react";
import api from "../services/api";
import type { Technician } from "../types/technician";

export function useTechnicians() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchTechnicians() {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/admin/technicians");

      setTechnicians(response.data.technician);
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
    fetchTechnicians();
  }, []);

  return { technicians, loading, error, refetch: fetchTechnicians };
}
