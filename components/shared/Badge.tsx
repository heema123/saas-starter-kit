import { Badge as BaseBadge } from '@/lib/components/ui/badge';
import { cn } from '@/lib/lib/utils';
import { VariantProps } from 'class-variance-authority';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof BaseBadge> {
  children: React.ReactNode;
  className?: string;
}

const Badge = (props: BadgeProps) => {
  const { children, className, variant = 'default', ...rest } = props;

  return (
    <BaseBadge
      variant={variant}
      className={cn('rounded text-xs py-2', className)}
      {...rest}
    >
      {children}
    </BaseBadge>
  );
};

export default Badge;
