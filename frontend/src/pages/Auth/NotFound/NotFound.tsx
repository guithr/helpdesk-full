// src/pages/NotFound.tsx
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>A página que você tentou acessar não existe ou foi movida.</p>

      <button onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
}
