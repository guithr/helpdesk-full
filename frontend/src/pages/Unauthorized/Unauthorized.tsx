import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import Icon from "../../components/icon/Icon";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

import CircleAlert from "../../assets/icons/circle-alert.svg?react";

export function Unauthorized() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-2 bg-gray-600">
      <Icon svg={CircleAlert} className="fill-feedback-danger w-20 h-20" />
      <Text variant="text-xl" as="h1">
        Acesso negado
      </Text>
      <Text as="p" className="max-w-sm text-center">
        Você não tem permissão para acessar esta página.
      </Text>

      {isAuthenticated ? (
        <Button onClick={() => navigate("/ticket")}>Voltar para Início</Button>
      ) : (
        <Button onClick={() => navigate("/signin")}>Fazer Login</Button>
      )}
    </div>
  );
}
