import axios from "axios";

// Cria a instância do axios
export const api = axios.create({
  baseURL: "http://localhost:3333", // URL do seu backend
  withCredentials: true, // Mantém cookies se necessário
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
