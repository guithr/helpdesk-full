import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const cardVariants = tv({
  base: "rounded-[10px] bg-gray-600 border-solid border-gray-500",
});

interface CardProps
  extends VariantProps<typeof cardVariants>,
    React.ComponentProps<"div"> {
  as?: keyof React.JSX.IntrinsicElements;
}

export function Card({ as = "div", children, className, ...props }: CardProps) {
  return React.createElement(
    as,
    {
      className: cardVariants({ className }),
      ...props,
    },
    children
  );
}
