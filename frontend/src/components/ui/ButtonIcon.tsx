import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import Icon from "../icon/Icon";

export const buttonVariants = tv({
  base: `
    flex items-center justify-center gap-2
    font-bold
    transition group 
    cursor-pointer
    border-none rounded-[5px] 
  `,
  variants: {
    variant: {
      primary: "bg-gray-200 text-gray-600 hover:bg-gray-100",
      secondary:
        "bg-gray-500 text-gray-200 hover:bg-gray-400 hover:text-gray-100",
      danger: "bg-gray-500 text-gray-200 hover:bg-gray-400 hover:text-gray-100",
      link: "bg-transparent text-gray-300 hover:bg-gray-500",
      linkDefault: "bg-transparent text-gray-300 ",
    },
    size: {
      md: "h-10 px-4 py-2.5",
      sm: "h-7 px-2 py-1.5",
    },
    disabled: {
      true: "opacity-50 pointer-events-none cursor-not-allowed",
    },
    iconOnly: {
      true: "gap-0",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    disabled: false,
    iconOnly: false,
  },
});

interface ButtonIconProps
  extends Omit<React.ComponentProps<"button">, "size" | "disabled">,
    VariantProps<typeof buttonVariants> {
  icon: React.ComponentProps<typeof Icon>["svg"];
}
export const buttonIconVariants = tv({
  variants: {
    variant: {
      primary: "fill-gray-600",
      secondary: "fill-gray-200",
      danger: "fill-feedback-danger",
      link: "fill-gray-300",
      linkDefault: "fill-gray-300",
    },
    size: {
      md: "h-[18px] w-[18px]",
      sm: "h-[14px] w-[14px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export default function ButtonIcon({
  variant,
  size,
  disabled,
  className,
  icon: IconComponent,
  ...props
}: ButtonIconProps) {
  return (
    <button
      className={buttonVariants({ variant, size, disabled, className })}
      {...props}
    >
      <Icon
        svg={IconComponent}
        className={buttonIconVariants({ variant, size, className })}
      />
    </button>
  );
}
