// src/pages/SignIn/index.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  signInSchema,
  type SignInFormData,
} from "../../validations/authSchema";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Text from "../../components/ui/Text";
import { useAuth } from "../../hooks/useAuth";

export function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: SignInFormData) {
    try {
      await signIn(data.email, data.password);
      // O navigate já está sendo chamado dentro do signIn (AuthContext)
    } catch (err: any) {
      const backend = err.response?.data;

      if (backend?.fieldErrors) {
        // Aplica erros específicos por campo
        Object.entries(backend.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof SignInFormData, {
            message: message as string,
          });
        });
      } else {
        // Erro geral (credenciais inválidas, servidor fora, etc)
        setError("root", {
          type: "manual",
          message:
            backend?.message || "Erro ao fazer login. Verifique seus dados.",
        });
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="p-6 md:p-7 border border-gray-500 rounded-[10px] md:rounded-[20px]">
        <Text as="h1" variant="text-lg" className="text-gray-200">
          Acesse o portal
        </Text>
        <Text variant="text-xs-regular" className="text-gray-300">
          Entre usando seu e-mail e senha cadastrados
        </Text>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col pt-8 md:pt-10"
        >
          <div className="flex flex-col gap-4 mb-10">
            <Input
              label="E-mail"
              placeholder="exemplo@mail.com"
              {...register("email")}
              error={errors.email?.message}
              helperText={errors.email?.message}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              {...register("password")}
              error={errors.password?.message}
              helperText={errors.password?.message}
            />

            {/* Mensagem de erro geral */}
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
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>

      <div className="p-6 md:p-7 flex flex-col border border-gray-500 rounded-[10px]">
        <Text as="h3" variant="heading-md-bold" className="text-gray-200">
          Ainda não tem uma conta?
        </Text>
        <Text variant="text-xs-regular" className="text-gray-300 mb-5 md:mb-6">
          Cadastre-se agora mesmo
        </Text>
        <Button variant="secondary" onClick={() => navigate("/signup")}>
          Criar conta
        </Button>
      </div>
    </div>
  );
}
