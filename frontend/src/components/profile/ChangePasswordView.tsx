import { DialogHeader, DialogBody, DialogFooter } from "../layouts/Dialog";
import Text from "../ui/Text";
import Button from "../ui/Button";
import ButtonIcon from "../ui/ButtonIcon";
import Input from "../ui/Input";
import ChevronLeft from "../../assets/icons/arrow-left.svg?react";
import api from "../../services/api";
import { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "A senha atual deve ter no mínimo 6 caracteres"),
  newPassword: z
    .string()
    .min(6, "A nova senha deve ter no mínimo 6 caracteres"),
});

interface ChangePasswordViewProps {
  onBack: () => void;
  onSuccess?: () => void;
}

type ChangePasswordFormInput = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordView({
  onBack,
  onSuccess,
}: ChangePasswordViewProps) {
  // ⭐️ Estados de feedback de API
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setError,
  } = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: ChangePasswordFormInput) => {
    setApiError(null);
    setSuccess(false);

    try {
      // Chamada à API (rota que espera currentPassword e newPassword)
      await api.patch("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      setSuccess(true);
      reset(); // Limpa os campos

      // Notificação e retorno à tela de perfil
      setTimeout(() => {
        onSuccess?.();
        onBack();
      }, 1500);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Erro ao alterar a senha. Verifique a senha atual.";

      // ⚠️ Tenta setar o erro no campo específico 'currentPassword' se for erro de autenticação
      if (message.includes("atual está incorreta")) {
        setError("currentPassword", { type: "manual", message: message });
      } else {
        setApiError(message);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <ButtonIcon
              className="p-0"
              icon={ChevronLeft}
              variant="linkDefault"
              onClick={onBack}
              aria-label="Voltar"
              disabled={isSubmitting}
            />
            <Text variant="text-md-bold">Alterar senha</Text>
          </div>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4 px-7">
            <Input
              label="Senha atual"
              type="password"
              placeholder="Digite sua senha atual"
              {...register("currentPassword")}
              error={errors.currentPassword?.message}
              disabled={isSubmitting || success}
            />
            <Input
              label="Nova senha"
              type="password"
              placeholder="Digite sua nova senha"
              helperText="Mínimo de 6 dígitos"
              {...register("newPassword")}
              error={errors.newPassword?.message}
              disabled={isSubmitting || success}
            />

            {/* Feedback de erro geral da API */}
            {apiError && (
              <div className="bg-feedback-danger border-l-4 border-red-500 p-3 mt-2">
                <Text variant="text-sm-regular" className="text-white">
                  {apiError}
                </Text>
              </div>
            )}

            {/* Feedback de sucesso */}
            {success && (
              <Text variant="text-sm-regular" className="text-green-500 mt-2">
                Senha alterada com sucesso!
              </Text>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || success || !isValid}
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
