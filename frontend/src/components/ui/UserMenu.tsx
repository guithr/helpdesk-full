import { tv, type VariantProps } from "tailwind-variants";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils/getInitials";
import Text from "./Text";

import CircleUser from "../../assets/icons/circle-user.svg?react";
import LogOut from "../../assets/icons/log-out.svg?react";
import UserMenuItem from "./UserMenuItem";
import ProfileDialog from "../profile/ProfileDialog";

export const UserMenuVariants = tv({
  base: `flex items-center justify-center
         md:px-4 md:py-5 
         gap-3
         md:border-t md:border-t-gray-200
         transition-colors
         cursor-pointer select-none`,
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

interface UserMenuProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof UserMenuVariants> {
  onOpenProfileModal?: () => void;
}

export default function UserMenu({
  state,
  className,
  onOpenProfileModal,
  ...props
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      // Ignora cliques dentro do Dialog (que está em um Portal)
      if (target instanceof Element && target.closest('[role="dialog"]')) {
        return;
      }

      // Fecha apenas se clicar fora do menuRef
      if (!menuRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) return null;

  return (
    <div className="md:w-full md:relative" ref={menuRef}>
      {/* Botão que abre o dropdown */}
      <div
        className={UserMenuVariants({
          className,
          state: open ? "active" : "default",
        })}
        {...props}
        onClick={() => setOpen(!open)}
      >
        <div className="size-10 md:size-8 flex items-center justify-center rounded-full bg-blue-dark">
          <Text variant="text-sm-regular" className="text-gray-600">
            {getInitials(user.name)}
          </Text>
        </div>

        <div className="hidden md:flex md:flex-col flex-1 min-w-0">
          <Text variant="text-sm-regular" className="text-gray-600 truncate">
            {user.name}
          </Text>
          <Text variant="text-xs-regular" className="text-gray-400 truncate">
            {user.email}
          </Text>
        </div>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="flex flex-col gap-4 bg-gray-100
          w-full absolute
          px-5 py-4
          top-25 left-0 
          md:bottom-2  md:left-52 md:top-auto 
          md:w-48 md:rounded-[5px]"
        >
          <Text className="text-gray-400" variant="text-xxs">
            Opções
          </Text>

          <nav className="flex flex-col gap-2">
            <ProfileDialog>
              <UserMenuItem label="Perfil" icon={CircleUser} />
            </ProfileDialog>

            <UserMenuItem
              label="Sair"
              icon={LogOut}
              variant="danger"
              onClick={() => {
                signOut();
                setOpen(false);
              }}
            />
          </nav>
        </div>
      )}
    </div>
  );
}
