import { Input } from '@/lib/components/ui/input';
import { Label } from '@/lib/components/ui/label';

import { CopyToClipboardButton } from '@/components/shared';

interface InputWithCopyButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

const InputWithCopyButton = ({ 
  label, 
  value, 
  description, 
  ...rest 
}: InputWithCopyButtonProps) => {
  const id = label.replace(/ /g, '');

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center">
        <Label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </Label>
        <CopyToClipboardButton value={value?.toString() || ''} />
      </div>
      <Input
        id={id}
        className="w-full text-sm"
        {...rest}
        value={value}
      />
      {description && (
        <div className="mt-1 text-sm text-gray-500">
          {description}
        </div>
      )}
    </div>
  );
};

export default InputWithCopyButton;
