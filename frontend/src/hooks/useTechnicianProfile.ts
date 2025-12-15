import { useEffect, useState } from "react";
import api from "../services/api";
import type { Technician } from "../types/technician";
import { useAuth } from "./useAuth";

export function useTechnicianProfile() {
  const { user } = useAuth();

  const [technicianProfile, setTechnicianProfile] = useState<Technician | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTechnicianProfile() {
    if (!user || user.role !== "TECHNICIAN") {
      setTechnicianProfile(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/auth/me");

      setTechnicianProfile(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao carregar perfil do técnico";
      setError(errorMessage);
      console.error("Erro ao buscar perfil do técnico:", err);
      setTechnicianProfile(null); // Limpa o perfil em caso de erro
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTechnicianProfile();
  }, [user?.id]);

  return { technicianProfile, loading, error, refetch: fetchTechnicianProfile };
}
