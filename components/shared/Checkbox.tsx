import React from 'react';
import { Checkbox as CheckboxBase } from '@/lib/components/ui/checkbox';
import { cn } from '@/lib/lib/utils';

interface CheckboxProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name: string;
  value: string;
  label: string;
  defaultChecked: boolean;
  className?: string;
}

const Checkbox = ({
  onChange,
  name,
  value,
  label,
  defaultChecked,
  className,
}: CheckboxProps) => {
  const id = `checkbox-${name}-${value}`;
  
  return (
    <div className={cn('flex items-center', className || '')} key={value}>
      <div className="flex items-center gap-2 text-sm">
        <CheckboxBase
          id={id}
          name={name}
          value={value}
          onCheckedChange={onChange as any}
          defaultChecked={Boolean(defaultChecked)}
        />
        <label htmlFor={id} className="text-gray-700 cursor-pointer">
          {label}
        </label>
      </div>
    </div>
  );
};

export default Checkbox;
