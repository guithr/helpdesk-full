import { useAuth } from "../../hooks/useAuth";
import { tv } from "tailwind-variants";

import Text from "../ui/Text";
import Icon from "../icon/Icon";

import LogoLight from "../../assets/logos/Logo_IconLight.svg?react";

const HeaderVariants = tv({
  base: "flex items-center gap-3",
});

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { user } = useAuth();
  return (
    <div className={HeaderVariants({ className })}>
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
