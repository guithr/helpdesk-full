import z from "zod";

export const signInSchema = z.object({
  email: z.email({ error: "Insira um e-mail válido" }).trim().toLowerCase(),
  password: z
    .string()
    .min(6, { error: "A senha deve ter pelo menos 6 caracteres" }),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z.string().trim().min(2, { error: "Nome é obrigatório" }),
  email: z.email({ error: "E-mail inválido" }).trim().toLowerCase(),
  password: z
    .string()
    .min(6, { error: "A senha deve ter pelo menos 6 dígitos" }),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
