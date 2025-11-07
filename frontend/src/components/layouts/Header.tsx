import { useAuth } from "../../hooks/useAuth";

import Text from "../ui/Text";
import Icon from "../icon/Icon";

import LogoLight from "../../assets/logos/Logo_IconLight.svg?react";

export function Header() {
  const { user } = useAuth();
  return (
    <div className="flex gap-3 items-center justify-center">
      <Icon svg={LogoLight} className="w-11" />
      <div className="flex flex-col">
        <Text variant="text-lg" className="text-gray-600">
          HelpDesk
        </Text>
        <Text variant="text-xxs" className="text-blue-light">
          {user?.role}
        </Text>
      </div>
    </div>
  );
}
