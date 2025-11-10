import { NavLink } from "react-router-dom";
import { tv } from "tailwind-variants";

import Text from "./Text";
import Icon from "../icon/Icon";

export const menuLinkVariants = tv({
  base: `flex items-center gap-3
  rounded-[5px]
  p-3
  cursor-pointer
  transition group`,
  variants: {
    state: {
      default:
        "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500",
      active: "bg-blue-dark text-gray-600",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const menuLinkIconVariants = tv({
  variants: {
    state: {
      default: "fill-gray-400 group-hover:fill-gray-500",
      active: "fill-gray-600",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

interface MenuLinkProps {
  to: string;
  label: string;
  className?: string;
  icon: React.ComponentProps<typeof Icon>["svg"];
}

export default function MenuLink({
  to,
  label,
  icon: IconComponent,
  className,
}: MenuLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        menuLinkVariants({
          state: isActive ? "active" : "default",
          className,
        })
      }
    >
      {({ isActive }) => (
        <>
          {IconComponent && (
            <Icon
              svg={IconComponent}
              className={menuLinkIconVariants({
                state: isActive ? "active" : "default",
              })}
              size="lg"
            />
          )}
          <Text variant="text-sm-regular">{label}</Text>
        </>
      )}
    </NavLink>
  );
}
