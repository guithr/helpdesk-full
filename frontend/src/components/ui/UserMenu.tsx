import { tv, type VariantProps } from "tailwind-variants";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/getInitials";
import Text from "./Text";

import CircleUser from "../../assets/icons/circle-user.svg?react";
import LogOut from "../../assets/icons/log-out.svg?react";
import UserMenuItem from "./UserMenuItem";

export const UserMenuVariants = tv({
  base: `flex items-center justify-center
         md:px-4 md:py-5 
         gap-3
         md:border-t-gray-200 md:border-t
         transition
         cursor-pointer
         `,
  variants: {
    state: {
      default: "bg-gray-100 hover:bg-gray-200",
      active: "bg-gray-200",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

interface userMenuProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof UserMenuVariants> {}

export default function UserMenu({
  state,
  className,
  ...props
}: userMenuProps) {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full relative">
      <div
        className={UserMenuVariants({
          className,
          state: open ? "active" : "default",
        })}
        {...props}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-center p-[10px] max-w-8  max-h-8 rounded-full bg-blue-dark">
          <Text variant="text-sm-regular" className="text-gray-600 ">
            {getInitials(user.name)}
          </Text>
        </div>
        <div className="hidden md:flex md:flex-col overflow-hidden max-w-[140px]">
          <Text
            variant="text-sm-regular"
            className=" text-gray-600 truncate whitespace-nowrap"
          >
            {user?.name}
          </Text>
          <Text
            variant="text-xs-regular"
            className="text-gray-400 truncate whitespace-nowrap"
          >
            {user?.email}
          </Text>
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-4 bg-gray-100 rounded-[5px] absolute bottom-2 left-52 px-5 py-4 w-48 ">
          <Text className="text-gray-400 " variant="text-xxs">
            Opções
          </Text>
          <nav className="flex flex-col gap-2">
            <UserMenuItem
              label="Perfil"
              icon={CircleUser}
              onClick={() => alert("Modal futuro")}
            />

            <UserMenuItem
              label="Sair"
              icon={LogOut}
              variant="danger"
              onClick={signOut}
            />
          </nav>
        </div>
      )}
    </div>
  );
}
