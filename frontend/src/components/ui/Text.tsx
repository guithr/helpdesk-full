import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const textVariants = tv({
  base: `font-sans`,
  variants: {
    variant: {
      "text-xl": "text-[24px] leading-[140%] font-bold", // 24px
      "text-lg": "text-[20px] leading-[140%] font-bold", // 20px
      "text-md-regular": "text-[16px] leading-[140%] font-normal", // 16px
      "text-md-bold": "text-[16px] leading-[140%] font-bold", // 16px
      "text-sm-regular": "text-[14px] leading-[140%] font-normal", // 14px
      "text-sm-bold": "text-[14px] leading-[140%] font-bold", // 14px
      "text-xs-regular": "text-[12px] leading-[140%] font-normal", // 12px
      "text-xs-bold": "text-[12px] leading-[140%] font-bold", // 12px
      "text-xxs": "text-[10px] leading-[140%] font-bold uppercase", // 10px uppercase
    },
  },
  defaultVariants: {
    variant: "text-md-regular",
  },
});

interface TextProps extends VariantProps<typeof textVariants> {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children?: React.ReactNode;
}

export default function Text({
  as = "span",
  variant,
  className,
  children,
  ...props
}: TextProps) {
  return React.createElement(
    as,
    {
      className: textVariants({ variant, className }),
      ...props,
    },
    children
  );
}
