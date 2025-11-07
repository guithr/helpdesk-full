// src/pages/NotFound.tsx
import { useNavigate } from "react-router-dom";

import Icon from "../../components/icon/Icon";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

import CircleHelp from "../../assets/icons/circle-help.svg?react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-2 bg-gray-600">
      <Icon svg={CircleHelp} className="fill-feedback-danger w-20 h-20" />
      <Text variant="text-xl" as="h1">
        Página não encontrada
      </Text>
      <Text as="p" className="max-w-sm text-center">
        Ops! A página que você está procurando não existe ou foi movida.
      </Text>
      <Button onClick={() => navigate("/")}>Voltar para Início</Button>
    </div>
  );
}
