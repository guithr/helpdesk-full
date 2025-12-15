import { useAuth } from "../../hooks/useAuth";
import { useTechnicianProfile } from "../../hooks/useTechnicianProfile";
import { getInitials } from "../../utils/getInitials";
import { DialogHeader, DialogBody, DialogFooter } from "../layouts/Dialog";
import Text from "../ui/Text";
import Button from "../ui/Button";
import ButtonIcon from "../ui/ButtonIcon";
import Input from "../ui/Input";
import Trash from "../../assets/icons/trash.svg?react";
import Upload from "../../assets/icons/upload.svg?react";
import TagTime from "../ui/TagTime";
import Divider from "../ui/Divider";

interface ProfileViewProps {
  onChangePassword: () => void;
}

export default function ProfileView({ onChangePassword }: ProfileViewProps) {
  const { user } = useAuth();
  const { technicianProfile } = useTechnicianProfile();

  if (!user) return null;

  const isTechnician = user.role === "TECHNICIAN";
  const availableHours = technicianProfile?.technician?.availableHours || [];

  return (
    <>
      <DialogHeader>Perfil</DialogHeader>
      <DialogBody>
        <div className="flex flex-col">
          <div className="flex flex-col gap-5 px-7  pb-8">
            <div className="flex items-center gap-3">
              <div className="size-12 md:size-12 flex items-center justify-center rounded-full bg-blue-dark">
                <Text variant="text-sm-regular" className="text-gray-600">
                  {getInitials(user.name)}
                </Text>
              </div>
              <div className="flex items-center gap-1">
                <Button icon={Upload} variant="secondary" size="sm">
                  Nova imagem
                </Button>
                <ButtonIcon
                  variant="danger"
                  size="sm"
                  icon={Trash}
                  aria-label="Remover imagem"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 ">
              <Input
                label="Nome"
                defaultValue={user.name}
                placeholder="Seu nome completo"
              />
              <Input
                label="E-mail"
                type="email"
                defaultValue={user.email}
                placeholder="seu@email.com"
                disabled
              />

              <div className="flex flex-col gap-2 relative">
                <Input label="Senha" type="password" value="••••••••" />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-0 top-[45%]"
                  onClick={onChangePassword}
                >
                  Alterar senha
                </Button>
              </div>
            </div>
          </div>

          {isTechnician && (
            <>
              <Divider />
              <div className="flex flex-col px-7 pt-5">
                <Text variant="text-sm-bold" className="text-gray-200">
                  Disponibilidade
                </Text>
                <Text variant="text-sm-regular" className="text-gray-300">
                  Horários de atendimento definidos pelo admin
                </Text>
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableHours.slice(0, 6).map((hour, index) => (
                    <TagTime state="readonly" key={index}>
                      {hour}
                    </TagTime>
                  ))}
                  {/* {(availableHours?.length || 0) > 5 && (
                  <TagTime state="readonly" key="remaining">
                    +{(availableHours?.length || 0) - 5}
                  </TagTime>
                )} */}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button className="w-full">Salvar</Button>
      </DialogFooter>
    </>
  );
}
