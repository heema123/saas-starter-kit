import React from 'react';
import { Button as UIButton, ButtonProps as UIButtonProps } from '@/lib/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/lib/utils';

export interface ButtonProps extends Omit<UIButtonProps, 'animate'> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  withAnimation?: boolean;
  gradient?: boolean;
  glass?: boolean;
  subtle?: boolean;
  success?: boolean;
  warning?: boolean;
  info?: boolean;
  roundedFull?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'default',
    size = 'default',
    loading = false,
    leftIcon,
    rightIcon,
    withAnimation = false,
    gradient = false,
    glass = false,
    subtle = false,
    success = false,
    warning = false,
    info = false,
    roundedFull = false,
    children,
    ...props
  }, ref) => {
    // Determine the variant based on the props
    let buttonVariant = variant;
    if (gradient) buttonVariant = 'gradient';
    if (glass) buttonVariant = 'glass';
    if (subtle) buttonVariant = 'subtle';
    if (success) buttonVariant = 'success';
    if (warning) buttonVariant = 'warning';
    if (info) buttonVariant = 'info';

    const buttonContent = (
      <>
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {leftIcon && !loading && leftIcon}
        {children}
        {rightIcon && rightIcon}
      </>
    );

    // Use native UIButton or wrap with motion
    if (withAnimation) {
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <UIButton
            ref={ref}
            className={cn(roundedFull && "rounded-full", className)}
            variant={buttonVariant as any}
            size={size}
            disabled={loading || props.disabled}
            {...props}
          >
            {buttonContent}
          </UIButton>
        </motion.div>
      );
    }

    return (
      <UIButton
        ref={ref}
        className={cn(roundedFull && "rounded-full", className)}
        variant={buttonVariant as any}
        size={size}
        disabled={loading || props.disabled}
        {...props}
      >
        {buttonContent}
      </UIButton>
    );
  }
);

Button.displayName = 'Button';

export { Button }; 