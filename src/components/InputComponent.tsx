import { useId } from "react";
import type { ChangeEvent } from "react";
import * as Label from "@radix-ui/react-label";

interface InputComponentProps {
  label: string;
  value: number;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  step?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function InputComponent({
  label,
  value,
  disabled = false,
  type = "text",
  placeholder = "",
  step = "",
  onChange,
}: InputComponentProps) {
  const id = useId();

  return (
    <div>
      <Label.Root
        htmlFor={id}
        className="block font-medium text-gray-700 dark:text-gray-300"
      >
        {label}:
      </Label.Root>
      <input
        id={id}
        className={`h-6 border-b w-full focus:outline-none text-gray-500 dark:text-gray-400 bg-transparent ${disabled ? "bg-gray-300 dark:bg-gray-600 border-red-500" : "border-green-500"}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        type={type}
        placeholder={placeholder}
        step={step}
        min="0"
      />
    </div>
  );
}

export default InputComponent;
