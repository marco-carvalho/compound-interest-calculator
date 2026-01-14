import React from "react";

interface InputComponentProps {
  label: string;
  value: number;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  step?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  value,
  disabled = false,
  type = "text",
  placeholder = "",
  step = "",
  onChange,
}) => {
  return (
    <div>
      <label className="block font-medium text-gray-700 dark:text-gray-300">
        {label}:
      </label>
      <input
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
};

export default InputComponent;
