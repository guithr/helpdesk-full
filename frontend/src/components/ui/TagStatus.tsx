import React from "react";
import CircleHelp from "../../assets/icons/circle-help.svg?react";
import Clock from "../../assets/icons/clock-2.svg?react";
import CircleCheck from "../../assets/icons/circle-check.svg?react";
import Icon from "../icon/Icon";
import Text from "./Text";
import { tv, type VariantProps } from "tailwind-variants";
import { type TicketStatus } from "../../types/ticket";

export const tagStatusVariants = tv({
  base: "inline-flex items-center justify-center pl-1.5 pr-2 gap-1 py-1.5 rounded-full",
  variants: {
    variant: {
      new: "text-feedback-open bg-feedback-open/20",
      info: "text-feedback-progress bg-feedback-progress/20",
      success: "text-feedback-done bg-feedback-done/20",
      danger: "text-feedback-danger bg-feedback-danger/20",
    },
  },
  defaultVariants: {
    variant: "new",
  },
});

export const tagStatusIconVariants = tv({
  base: "",
  variants: {
    variant: {
      new: "fill-feedback-open",
      info: "fill-feedback-progress",
      success: "fill-feedback-done",
      danger: "fill-feedback-danger",
    },
  },
  defaultVariants: {
    variant: "new",
  },
});

interface TagStatusProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof tagStatusVariants> {
  status: TicketStatus;
  icon?: React.ComponentProps<typeof Icon>["svg"];
}

export function TagStatus({
  status,
  variant,
  icon: IconSvg,
  children,
  ...props
}: TagStatusProps) {
  const statusConfig = {
    OPEN: {
      label: "Aberto",
      variant: "new" as const,
      icon: CircleHelp,
    },
    IN_PROGRESS: {
      label: "Em atendimento",
      variant: "info" as const,
      icon: Clock,
    },
    CLOSED: {
      label: "Encerrado",
      variant: "success" as const,
      icon: CircleCheck,
    },
  };

  const config = statusConfig[status];

  return (
    <div className={tagStatusVariants({ variant: config.variant })} {...props}>
      <Icon
        svg={config.icon}
        size="md"
        className={tagStatusIconVariants({ variant: config.variant })}
      />
      <Text variant="text-xs-bold">{config.label}</Text>
    </div>
  );
}
