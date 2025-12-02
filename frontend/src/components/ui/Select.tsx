import { forwardRef, useState, useRef, useEffect } from "react";

import { tv } from "tailwind-variants";

import Text from "./Text";
import Icon from "../icon/Icon";

import CircleAlert from "../../assets/icons/circle-alert.svg?react";
import Chevron from "../../assets/icons/chevron-down.svg?react";
import Check from "../../assets/icons/check.svg?react";

// Variants
export const selectContainerVariants = tv({
  base: "flex flex-col w-full group gap-2",
});

export const labelVariants = tv({
  base: "text-gray-300 transition-colors group-focus-within:text-blue-base",
  variants: {
    state: {
      error: "text-feedback-danger group-focus-within:text-feedback-danger",
      default: "",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const borderVariants = tv({
  base: "relative border-b transition-colors cursor-pointer",
  variants: {
    state: {
      active: "border-blue-base",
      default: "border-gray-500",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const selectWrapperVariants = tv({
  base: `
    outline-none w-full bg-transparent cursor-pointer
    text-md-regular text-gray-200
    placeholder-gray-400
    pb-1 pr-6
    transition-colors
    focus:caret-blue-base
  `,
});

export const helperVariant = tv({
  base: "flex items-center gap-1 transition-colors",
  variants: {
    state: {
      error: "text-feedback-danger",
      default: "text-gray-400",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const dropdownVariants = tv({
  base: `
    absolute z-50 top-full mt-1 w-full flex flex-col
    bg-gray-600 outline outline-gray-400 shadow-2xl
    px-5 py-4 gap-4 rounded-[10px]
    max-h-56 overflow-y-auto
  `,
});

export const optionVariants = tv({
  base: "flex items-center justify-between cursor-pointer py-1 transition-colors",
  variants: {
    selected: {
      true: "text-gray-200",
      false: "text-gray-400 hover:text-gray-200",
    },
  },
  defaultVariants: {
    selected: false,
  },
});

export const chevronVariants = tv({
  base: "w-5 h-5 absolute right-0 top-1/2 -translate-y-1/2 transition-all",
  variants: {
    open: {
      true: "fill-blue-base rotate-180",
      false: "fill-gray-400 rotate-0",
    },
  },
  defaultVariants: {
    open: false,
  },
});

// Props
interface inputProps extends Omit<React.ComponentProps<"input">, "onSelect"> {
  label: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  options: { id: string; name: string; price: number }[];
  onSelect?: (item: { id: string; name: string; price: number }) => void;
}

export default function Select({
  label,
  placeholder,
  helperText,
  error,
  options,
  onSelect,
  ...props
}: inputProps) {
  const [open, setOpen] = useState(false);
  const [selectValue, setSelectValue] = useState(""); // texto visível no input
  const [selectedValue, setSelectedValue] = useState(""); // valor selecionado

  const containerRef = useRef<HTMLDivElement>(null);

  const state = error ? "error" : "default";
  const borderState = open ? "active" : "default";

  const inputId = `select-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(selectValue.toLowerCase())
  );

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSelectValue(value);
    setSelectedValue("");

    if (!open) setOpen(true);
  };

  const handleSelectItem = (item: {
    id: string;
    name: string;
    price: number;
  }) => {
    setSelectedValue(item.name);
    setSelectValue(item.name);
    setOpen(false);

    // Enviar para o componente pai
    if (onSelect) onSelect(item);
  };

  return (
    <div className={selectContainerVariants()} ref={containerRef}>
      <label htmlFor={inputId} className={labelVariants({ state })}>
        <Text variant="text-xxs" className="text-gray-300">
          {label}
        </Text>
      </label>

      <div className="relative">
        <div
          className={borderVariants({ state: borderState })}
          onClick={handleToggle}
        >
          <input
            {...props}
            id={inputId}
            className={selectWrapperVariants()}
            value={selectValue}
            placeholder={placeholder}
            onChange={handleInputChange}
          />

          <Icon svg={Chevron} className={chevronVariants({ open })} />
        </div>

        {open && (
          <div className={dropdownVariants()}>
            <Text variant="text-xxs" className="text-gray-400">
              Opções
            </Text>

            <div className="flex flex-col gap-4 py-2">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((item) => (
                  <div
                    key={item.id}
                    className={optionVariants({
                      selected: selectedValue === item.name,
                    })}
                    onClick={() => handleSelectItem(item)}
                  >
                    <span>{item.name}</span>

                    {selectedValue === item.name && (
                      <Icon svg={Check} className="w-4 h-4 fill-blue-base" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 py-2 text-center">
                  <Text variant="text-xs-regular">
                    Nenhuma opção encontrada
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {helperText && (
        <div className={helperVariant({ state })}>
          {state === "error" && (
            <Icon
              svg={CircleAlert}
              className="w-4 h-4 fill-current text-feedback-danger"
            />
          )}

          <Text variant="text-xs-regular">{helperText}</Text>
        </div>
      )}
    </div>
  );
}
