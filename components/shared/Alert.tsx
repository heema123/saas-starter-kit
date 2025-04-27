import React from 'react';
import { Alert as AlertBase, AlertDescription } from '@/lib/components/ui/alert';
import { cn } from '@/lib/lib/utils';

interface AlertProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive';
}

const Alert = (props: AlertProps) => {
  const { children, className, variant = 'default', ...rest } = props;

  return (
    <AlertBase variant={variant} className={cn('rounded px-4 py-3', className)} {...rest}>
      <AlertDescription>{children}</AlertDescription>
    </AlertBase>
  );
};

export default Alert;
