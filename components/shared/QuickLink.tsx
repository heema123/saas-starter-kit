import React from 'react';
import { Button } from './Button';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface QuickLinkProps {
  href: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  gradient?: boolean;
  glass?: boolean;
  subtle?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

const QuickLink: React.FC<QuickLinkProps> = ({ 
  href, 
  title, 
  description, 
  icon,
  gradient = false,
  glass = false,
  subtle = true,
  variant = 'outline'
}) => {
  return (
    <Button
      asChild
      variant={variant}
      glass={glass}
      gradient={gradient}
      subtle={subtle}
      className="h-auto w-full justify-between py-3 px-4"
      rightIcon={<ChevronRightIcon className="h-5 w-5 text-muted-foreground" />}
      leftIcon={icon}
      withAnimation
    >
      <Link href={href}>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">{title}</span>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </Link>
    </Button>
  );
};

export default QuickLink; 