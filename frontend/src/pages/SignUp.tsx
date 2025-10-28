import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { signUpSchema, type SignUpFormData } from "../validations/authSchema";

import Button from "../components/Button";
import Input from "../components/Input";
import Text from "../components/Text";

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
      const res = await axios.post(
        "http://localhost:3333/auth/register",
        data,
        {
          withCredentials: true,
        }
      );
      navigate("/signin", { replace: true });
      console.log("Conta cadastrada:", res.data);
    } catch (err: any) {
      // padrão: backend retorna { message, fieldErrors }
      const backend = err.response?.data;
      if (backend?.fieldErrors) {
        // aplica erros por campo
        Object.entries(backend.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof SignUpFormData, {
            message: message as string,
          });
        });
      } else {
        // erro geral (mostre num toast ou num campo root)
        setError("name", {
          message: backend?.message || "Erro ao criar conta",
        });
        // note: RHF não tem 'root' por padrão; você pode usar setError on any field or store general message in state
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
              // helperText={"Mínimo de 6 dígitos"}
              {...register("password")}
              error={errors.password?.message}
            />

            <Text
              variant="text-xs-regular"
              className="text-feedback-danger"
            ></Text>
          </div>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </div>

      <div className="p-6 md:p-7 flex flex-col border border-gray-500 rounded-[10px]">
        <Text as="h3" variant="heading-md-bold" className="text-gray-200">
          Já possuí uma conta?
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
