import { useState, useEffect } from "react";
import api from "../services/api";
import type { Service } from "../types/services";

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchServices() {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/customer/services");
      setServices(response.data.services);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao carregar serviços";
      setError(errorMessage);
      console.error("Erro ao buscar serviços:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
}
