import { Input } from '@/lib/components/ui/input';
import { Label } from '@/lib/components/ui/label';
import { cn } from '@/lib/lib/utils';
import { motion } from 'framer-motion';
import { AtSign, Lock, User, Briefcase } from 'lucide-react';
import { useTranslation } from 'next-i18next';

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  error?: string;
  descriptionText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const getIconByType = (type: string, name: string): React.ReactNode => {
  if (type === 'email' || name === 'email') {
    return <AtSign size={18} />;
  }
  if (type === 'password' || name === 'password') {
    return <Lock size={18} />;
  }
  if (name === 'name') {
    return <User size={18} />;
  }
  if (name === 'team') {
    return <Briefcase size={18} />;
  }
  return null;
};

const InputWithLabel = ({
  label,
  error,
  descriptionText,
  className,
  icon,
  iconPosition = 'left',
  type,
  name,
  ...rest
}: InputWithLabelProps) => {
  const { t } = useTranslation('common');
  const isRtl = t('direction') === 'rtl';
  const defaultIcon = getIconByType(type || '', name || '');
  const iconToRender = icon || defaultIcon;
  
  // In RTL mode, we should swap the icon positions
  const effectiveIconPosition = isRtl 
    ? (iconPosition === 'left' ? 'right' : 'left')
    : iconPosition;

  return (
    <motion.div 
      className="mb-4 relative group"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Label 
        className={cn(
          "block text-sm font-medium mb-1.5 transition-all duration-200",
          "group-focus-within:text-primary"
        )}
      >
        {label}
      </Label>
      
      <div className="relative">
        {iconToRender && effectiveIconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {iconToRender}
          </div>
        )}
        
        <Input
          className={cn(
            'w-full transition-all duration-200 rounded-md',
            'hover:border-primary/50',
            'focus-visible:border-primary focus-visible:ring-primary/20',
            iconToRender && effectiveIconPosition === 'left' ? 'pl-10' : '',
            iconToRender && effectiveIconPosition === 'right' ? 'pr-10' : '',
            error ? 'border-destructive focus-visible:ring-destructive/20 hover:border-destructive' : '',
            className
          )}
          type={type}
          name={name}
          dir={t('direction')}
          {...rest}
        />
        
        {iconToRender && effectiveIconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {iconToRender}
          </div>
        )}
      </div>
      
      {descriptionText && (
        <motion.div 
          className="mt-1.5 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          {descriptionText}
        </motion.div>
      )}
      
      {error && (
        <motion.div 
          className="mt-1.5 text-xs text-destructive font-medium"
          initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

export default InputWithLabel;
