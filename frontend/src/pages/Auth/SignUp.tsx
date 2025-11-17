import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // ← Use a instância configurada do axios

import {
  signUpSchema,
  type SignUpFormData,
} from "../../validations/authSchema";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Text from "../../components/ui/Text";

export function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data: SignUpFormData) {
    try {
      const res = await api.post("/auth/register", data);
      console.log("Conta cadastrada:", res.data);
      navigate("/signin", { replace: true });
    } catch (err: any) {
      const backend = err.response?.data;

      if (backend?.fieldErrors) {
        // Aplica erros específicos por campo
        Object.entries(backend.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof SignUpFormData, {
            message: message as string,
          });
        });
      } else if (backend?.message) {
        // Erro geral: exibe no primeiro campo ou cria um campo "root"
        setError("root", {
          type: "manual",
          message: backend.message,
        });
      } else {
        // Erro desconhecido
        setError("root", {
          type: "manual",
          message: "Erro ao criar conta. Tente novamente.",
        });
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="p-6 md:p-7 border border-gray-500 rounded-[10px] md:rounded-[20px]">
        <Text as="h1" variant="text-lg" className="text-gray-200">
          Crie sua conta
        </Text>
        <Text variant="text-xs-regular" className="text-gray-300">
          Informe seu nome, e-mail e senha
        </Text>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col pt-8 md:pt-10"
        >
          <div className="flex flex-col gap-4 mb-10">
            <Input
              label="Nome"
              placeholder="Digite o nome completo"
              {...register("name")}
              helperText={errors.name?.message}
              error={errors.name?.message}
            />

            <Input
              label="E-mail"
              placeholder="exemplo@mail.com"
              {...register("email")}
              helperText={errors.email?.message}
              error={errors.email?.message}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              helperText={errors.password?.message || "Mínimo de 6 dígitos"}
              {...register("password")}
              error={errors.password?.message}
            />

            {/* Exibe erro geral se existir */}
            {errors.root && (
              <Text
                variant="text-xs-regular"
                className="text-feedback-danger -mt-2"
              >
                {errors.root.message}
              </Text>
            )}
          </div>

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </div>

      <div className="p-6 md:p-7 flex flex-col border border-gray-500 rounded-[10px]">
        <Text as="h3" variant="text-md-bold" className="text-gray-200">
          Já possui uma conta?
        </Text>
        <Text variant="text-xs-regular" className="text-gray-300 mb-5 md:mb-6">
          Entre agora mesmo
        </Text>
        <Button variant="secondary" onClick={() => navigate("/signin")}>
          Acessar conta
        </Button>
      </div>
    </div>
  );
}
