import React from 'react';
import { NailIcon } from './NailIcon';

interface ServiceImagePlaceholderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ServiceImagePlaceholder({
  size = 'md',
  className = '',
}: ServiceImagePlaceholderProps) {
  const sizeClasses = {
    sm: 'w-15 h-15', // 60x60px
    md: 'w-20 h-20', // 80x80px
    lg: 'w-32 h-32', // 128x128px
  };

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-br from-pink-100 to-pink-200
        dark:from-pink-900/30 dark:to-pink-800/30
        rounded-lg flex items-center justify-center
        border border-pink-200 dark:border-pink-700
        ${className}
      `}
    >
      <NailIcon
        className="text-pink-400 dark:text-pink-300"
        size={iconSizes[size]}
      />
    </div>
  );
}
