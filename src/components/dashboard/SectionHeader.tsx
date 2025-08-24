'use client';

import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-300 mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
