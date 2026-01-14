import React from 'react';

interface SelectComponentProps {
  label: string;
  value: number;
  disabled?: boolean;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  label,
  value,
  disabled = false,
  options,
  onChange
}) => {
  return (
    <div>
      <label className="block font-bold">{label}:</label>
      <select
        className={`h-6 border-b w-full focus:outline-none ${disabled ? 'bg-gray-300 border-red-500' : 'border-green-500'}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((option, index) => (
          <option key={index} value={index}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
