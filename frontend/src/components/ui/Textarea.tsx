import type React from "react";
import { tv } from "tailwind-variants";
import Text from "./Text";
import Icon from "../icon/Icon";
import CircleAlert from "../../assets/icons/circle-alert.svg?react";

const container = tv({
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

const textareaStyles = tv({
  base: `
    w-full border-b pb-2 outline-none resize-none
    text-gray-200 placeholder-gray-400
    border-gray-500 
    focus:border-blue-base
    transition-colors
    min-h-[100px] 
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

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label: string;
  helperText?: string;
  error?: string;
}

export default function Textarea({
  label,
  helperText,
  error,
  ...props
}: TextareaProps) {
  const state = error ? "error" : "default";
  const id = props.id ?? `textarea-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className={container()}>
      <label htmlFor={id} className={labelStyles({ state })}>
        <Text variant="text-xxs">{label}</Text>
      </label>

      <textarea id={id} className={textareaStyles({ state })} {...props} />

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
