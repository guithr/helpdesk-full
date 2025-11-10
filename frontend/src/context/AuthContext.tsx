import { createContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TECHNICIAN" | "CUSTOMER";
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  loading: boolean; // ← Adicione para melhor UX
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ← Estado de carregamento

  // Carrega o usuário ao montar o componente
  useEffect(() => {
    async function loadStoredAuth() {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await api.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          setUser(res.data);
        } catch {
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    }

    loadStoredAuth();
  }, []); // ← Array vazio: executa apenas uma vez ao montar

  async function signIn(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
    if (user.role === "ADMIN") {
      navigate("/tickets");
    } else {
      navigate("/my-tickets");
    }
  }

  function signOut() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/signin");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        signOut,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {loading ? <div>Carregando...</div> : children}
    </AuthContext.Provider>
  );
}
