import React from 'react';

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
  onChange
}) => {
  return (
    <div>
      <label className="block font-bold">{label}:</label>
      <input
        className={`h-6 border-b w-full focus:outline-none ${disabled ? 'bg-gray-300 border-red-500' : 'border-green-500'}`}
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
