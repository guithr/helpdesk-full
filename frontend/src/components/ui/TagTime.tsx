import React, { useState } from "react";
import Text from "./Text";
import { tv, type VariantProps } from "tailwind-variants";
import Icon from "../icon/Icon";
import X from "../../assets/icons/x.svg?react";

export const tagTimeVariants = tv({
  base: "inline-flex items-center justify-center text-gray-200 px-3 py-2 rounded-full transition-color gap-1.5 h-7 border",
  variants: {
    state: {
      default:
        "bg-transparent border-gray-200 cursor-pointer hover:border-gray-400 hover:bg-gray-500 ",
      selected: "bg-blue-base border-blue-base text-white cursor-pointer",
      readonly: " text-gray-400 border-gray-500 cursor-not-allowed",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

interface TagTimeProps
  extends Omit<React.ComponentProps<"button">, "onClick">,
    VariantProps<typeof tagTimeVariants> {
  onClick?: () => void;
  initialSelected?: boolean;
}

export default function TagTime({
  state,
  children,
  onClick,
  initialSelected = false,
  ...props
}: TagTimeProps) {
  const [selected, setSelected] = useState(initialSelected);

  const handleClick = () => {
    if (state === "readonly") return;

    setSelected(!selected);
    onClick?.();
  };

  const currentState = selected ? "selected" : state;

  return (
    <button
      className={tagTimeVariants({ state: currentState })}
      onClick={handleClick}
      disabled={state === "readonly"}
      {...props}
    >
      <Text variant="text-xs-bold">{children}</Text>
      {selected && <Icon svg={X} size="sm" fill="white" />}
    </button>
  );
}
