import { useId } from "react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";

interface SelectComponentProps {
  label: string;
  value: number;
  disabled?: boolean;
  options: string[];
  onChange: (value: number) => void;
}

function SelectComponent({
  label,
  value,
  disabled = false,
  options,
  onChange,
}: SelectComponentProps) {
  const id = useId();

  return (
    <div>
      <Label.Root
        htmlFor={id}
        className="block font-medium text-gray-700 dark:text-gray-300"
      >
        {label}:
      </Label.Root>
      <Select.Root
        value={String(value)}
        onValueChange={(next) => onChange(Number(next))}
        disabled={disabled}
      >
        <Select.Trigger
          id={id}
          className={`h-6 border-b w-full focus:outline-none text-left text-gray-500 dark:text-gray-400 bg-transparent inline-flex items-center justify-between ${disabled ? "bg-gray-300 dark:bg-gray-600 border-red-500" : "border-green-500"}`}
        >
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={4}
            className="z-50 max-h-[min(24rem,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-md"
          >
            <Select.ScrollUpButton className="flex h-6 cursor-default items-center justify-center text-gray-500 dark:text-gray-400">
              ▲
            </Select.ScrollUpButton>
            <Select.Viewport className="p-1">
              {options.map((option, index) => (
                <Select.Item
                  key={index}
                  value={String(index)}
                  className="relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Select.ItemText>{option}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex h-6 cursor-default items-center justify-center text-gray-500 dark:text-gray-400">
              ▼
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export default SelectComponent;
