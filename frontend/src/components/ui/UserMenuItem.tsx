import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import Icon from "../icon/Icon";
import Text from "./Text";

export const UserMenuItemVariants = tv({
  base: `flex items-center gap-2
         py-2
         cursor-pointer
         transition
         group
        `,
  variants: {
    variant: {
      primary: "text-gray-400 hover:text-gray-500",
      danger: "text-feedback-danger/65 hover:text-feedback-danger",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export const UserMenuIconVariants = tv({
  base: `w-5 h-5
  transition`,
  variants: {
    variant: {
      primary: "fill-gray-400 group-hover:fill-gray-500",
      danger: "fill-feedback-danger/65 group-hover:fill-feedback-danger",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface UserMenuItemProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof UserMenuItemVariants> {
  label: string;
  className?: string;
  icon: React.ComponentProps<typeof Icon>["svg"];
}

export default function UserMenuItem({
  label,
  variant,
  className,
  icon: IconComponent,
  ...props
}: UserMenuItemProps) {
  return (
    <button className={UserMenuItemVariants({ variant, className })} {...props}>
      <Icon
        svg={IconComponent}
        className={UserMenuIconVariants({ variant, className })}
      />
      <Text variant="text-md-regular">{label}</Text>
    </button>
  );
}
