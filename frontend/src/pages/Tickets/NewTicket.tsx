import { type CreateTicketFormInput } from "../../types/ticket";
import { Navigate, useNavigate } from "react-router-dom";

import { z } from "zod";

import { useCreateTicket } from "../../hooks/useCreateTicket";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServices } from "../../hooks/useServices";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";

import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";

const createTicketSchema = z.object({
  title: z.string().min(5, "O título deve ter no mínimo 5 caracteres").trim(),
  description: z.string().optional(),
  serviceId: z.string().min(1, "Selecione uma categoria de serviço"),
});

export function NewTicket() {
  const { user } = useAuth();
  const { createTicket, loading, error } = useCreateTicket();
  const { services, loading: loadingServices } = useServices();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTicketFormInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      serviceId: "",
    },
  });

  if (user?.role !== "CUSTOMER") {
    return <Navigate to="/unauthorized" replace />;
  }

  const selectedServiceId = watch("serviceId");
  const selectedService = services.find(
    (service) => service.id === selectedServiceId
  );

  console.log(selectedService);

  const onSubmit = async (data: CreateTicketFormInput) => {
    try {
      await createTicket({
        title: data.title,
        description: data.description || undefined,
        service: [data.serviceId],
      });

      navigate("/my-tickets");
    } catch (err) {
      // Erro já tratado no hook
    }
  };

  if (loadingServices) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-base mx-auto mb-4"></div>
          <Text variant="text-md-regular" className="text-gray-600">
            Carregando serviços...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[800px]">
      <div className="mb-6 flex justify-between items-center">
        <Text variant="text-xl" className="text-blue-dark">
          Novo chamado
        </Text>
      </div>

      {error && (
        <div className="mb-4 bg-feedback-danger border-l-4 border-red-500 p-4">
          <Text variant="text-sm-regular">{error}</Text>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 items-start">
          <div className="p-8 flex flex-col border border-gray-500 rounded-[10px]">
            <div className="flex flex-col gap-1 mb-6">
              <Text variant="text-md-bold" className="text-gray-200">
                Informações
              </Text>
              <Text variant="text-xs-regular" className="text-gray-300">
                Preencha as informações do chamado para que possamos te atender
              </Text>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Título"
                placeholder="Digite um título para o chamado"
                {...register("title")}
                error={errors.title?.message}
                helperText={errors.title?.message}
              />

              <Textarea
                label="Descrição"
                placeholder="Descreva o que está acontecendo"
                {...register("description")}
                error={errors.description?.message}
              />

              <Select
                label="Categoria de serviço"
                placeholder="Selecione a categoria de atendimento"
                options={services}
                error={errors.serviceId?.message}
                helperText={errors.serviceId?.message}
                onSelect={(item) => {
                  setValue("serviceId", item.id, { shouldValidate: true });
                }}
              />
            </div>
          </div>

          <div className="p-8 flex flex-col gap-6 border border-gray-500 rounded-[10px] md:max-w-74">
            <div className="flex flex-col gap-1">
              <Text variant="text-md-bold" as="h2" className="text-gray-200">
                Resumo
              </Text>
              <Text variant="text-xs-regular" className="text-gray-300">
                Valores e detalhes
              </Text>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <Text as="h3" variant="text-xs-bold" className="text-gray-400">
                  Categoria de serviço
                </Text>
                <Text variant="text-sm-regular" className="text-gray-200">
                  {selectedService
                    ? selectedService.name
                    : "Nenhum selecionado"}
                </Text>
                {selectedService?.description && (
                  <Text
                    variant="text-xs-regular"
                    className="text-gray-300 mt-1"
                  >
                    {selectedService.description}
                  </Text>
                )}
              </div>

              <div className="flex flex-col">
                <Text
                  as="h3"
                  variant="text-xs-regular"
                  className="text-gray-400"
                >
                  Custo inicial
                </Text>
                <div className="flex items-center gap-1">
                  <Text variant="text-xs-bold">R$</Text>
                  <Text variant="text-lg" className="text-gray-200">
                    {selectedService
                      ? selectedService.price.toFixed(2)
                      : "0,00"}
                  </Text>
                </div>
              </div>
            </div>

            <Text as="p" variant="text-xs-regular" className="text-gray-300">
              O chamado será automaticamente atribuído a um técnico disponível
            </Text>

            <Button type="submit" disabled={loading || !selectedServiceId}>
              {loading ? "Criando..." : "Criar chamado"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
