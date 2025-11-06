import type React from "react";
import { tv } from "tailwind-variants";
import Text from "./Text";
import Icon from "../icon/Icon";
import CircleAlert from "../../assets/icons/circle-alert.svg?react";

const inputContainer = tv({
  base: "flex flex-col w-full gap-2 group",
});

const labelStyles = tv({
  base: `
    text-gray-300
    transition-colors
    group-focus-within:text-blue-base
  `,
  variants: {
    state: {
      default: "",
      error: "text-feedback-danger group-focus-within:text-feedback-danger",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

const inputStyles = tv({
  base: `
    w-full border-b pb-2 outline-none
    text-gray-200 placeholder-gray-400
    border-gray-500 
    focus:border-blue-base
    transition-colors
  `,
  variants: {
    state: {
      default: "",
      error:
        "border-feedback-danger text-feedback-danger focus:border-feedback-danger",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

const helperStyles = tv({
  base: "flex items-center gap-1 transition-colors",
  variants: {
    state: {
      default: "text-gray-400",
      error: "text-feedback-danger",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

// ----- TYPES -----
interface InputProps extends React.ComponentProps<"input"> {
  label: string;
  helperText?: string;
  error?: string;
}

// ----- COMPONENT -----
export default function Input({
  label,
  helperText,
  error,
  ...props
}: InputProps) {
  const state = error ? "error" : "default";
  const inputId =
    props.id ?? `input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={inputContainer()}>
      <label htmlFor={inputId} className={labelStyles({ state })}>
        <Text variant="text-xxs">{label}</Text>
      </label>

      <input id={inputId} className={inputStyles({ state })} {...props} />

      {helperText && (
        <div className={helperStyles({ state })}>
          {state === "error" && (
            <Icon
              svg={CircleAlert}
              size="md"
              className="fill-feedback-danger"
            />
          )}
          <Text variant="text-xs-regular">{helperText}</Text>
        </div>
      )}
    </div>
  );
}
