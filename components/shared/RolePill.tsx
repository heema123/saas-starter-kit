import React from 'react';
import { Role } from '@prisma/client';
import { cn } from '@/lib/lib/utils';

interface RolePillProps {
  role: Role;
  className?: string;
}

const RolePill = ({ role, className }: RolePillProps) => {
  const getColorByRole = () => {
    switch (role) {
      case 'OWNER':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'MEMBER':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getColorByRole(),
        className
      )}
    >
      {role}
    </span>
  );
};

export default RolePill; 