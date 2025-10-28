import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { signInSchema, type SignInFormData } from "../validations/authSchema";
import Button from "../components/Button";
import Input from "../components/Input";
import Text from "../components/Text";

export function SignIn() {
  const navigate = useNavigate();

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
      const res = await axios.post("http://localhost:3333/auth/login", data, {
        withCredentials: true,
      });

      console.log("Login bem-sucedido:", res.data);
      navigate("/dashboard");
    } catch (err: any) {
      // Erros vindos do backend
      const { message, fieldErrors } = err.response?.data || {};

      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([key, value]) => {
          setError(key as keyof SignInFormData, {
            message: value as string,
          });
        });
      } else {
        setError("root", {
          message: message || "Erro ao fazer login. Verifique seus dados.",
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

            {errors.root && (
              <Text variant="text-xs-regular" className="text-feedback-danger">
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
          Cadastre agora mesmo
        </Text>
        <Button variant="secondary" onClick={() => navigate("/signup")}>
          Criar conta
        </Button>
      </div>
    </div>
  );
}
