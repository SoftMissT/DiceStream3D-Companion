import React from 'react';
import { TextInput, type TextInputProps } from './TextInput';

interface NumberInputProps extends Omit<TextInputProps, 'onChange' | 'value' | 'type'> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, min, max, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let numValue = parseInt(e.target.value, 10);
    if (isNaN(numValue)) {
      numValue = min !== undefined ? min : 0;
    }
    if (min !== undefined && numValue < min) {
      numValue = min;
    }
    if (max !== undefined && numValue > max) {
      numValue = max;
    }
    onChange(numValue);
  };

  return (
    <div className='flex items-center gap-2'>
        {props.label && <label className="block text-sm font-medium text-text-secondary whitespace-nowrap">{props.label}</label>}
        <TextInput
          {...props}
          label=''
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          className="w-20 text-center"
        />
    </div>
  );
};
