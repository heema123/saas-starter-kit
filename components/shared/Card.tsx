import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import classNames from 'classnames';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps>, MotionProps {
  as?: React.ElementType;
  withBorder?: boolean;
  withShadow?: boolean;
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Card = ({
  as: Component = motion.div,
  withBorder = true,
  withShadow = true,
  hoverEffect = false,
  className,
  children,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 0.3 },
  ...props
}: CardProps) => {
  return (
    <Component
      className={classNames(
        'rounded-lg bg-card p-6',
        withBorder && 'border border-border',
        withShadow && 'shadow-sm',
        hoverEffect && 'hover:shadow-md hover:border-border/80 transition-all duration-200',
        className
      )}
      initial={initial}
      animate={animate}
      transition={transition}
      {...props}
    >
      {children}
    </Component>
  );
};

interface CardHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const CardHeader = ({ children, className }: CardHeaderProps) => (
  <div className={classNames('mb-4', className)}>
    {children}
  </div>
);

CardHeader.displayName = 'CardHeader';
Card.Header = CardHeader;

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

const CardTitle = ({ children, className }: CardTitleProps) => (
  <h3 className={classNames('text-lg font-semibold', className)}>{children}</h3>
);

CardTitle.displayName = 'CardTitle';
Card.Title = CardTitle;

interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const CardDescription = ({ children, className }: CardDescriptionProps) => (
  <p className={classNames('text-sm text-muted-foreground', className)}>{children}</p>
);

CardDescription.displayName = 'CardDescription';
Card.Description = CardDescription;

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

const CardBody = ({ children, className }: CardBodyProps) => (
  <div className={classNames('', className)}>{children}</div>
);

CardBody.displayName = 'CardBody';
Card.Body = CardBody;

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent = ({ children, className }: CardContentProps) => (
  <div className={className}>{children}</div>
);

CardContent.displayName = 'CardContent';
Card.Content = CardContent;

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter = ({ children, className }: CardFooterProps) => (
  <div className={classNames('mt-4 pt-4 border-t border-border', className)}>
    {children}
  </div>
);

CardFooter.displayName = 'CardFooter';
Card.Footer = CardFooter;

Card.displayName = 'Card';

export default Card;
