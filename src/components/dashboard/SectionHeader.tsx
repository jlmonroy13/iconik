'use client';

import { ReactNode } from 'react';

interface SectionHeaderStats {
  total: number;
  currentPage: number;
  totalPages: number;
  currentCount?: number;
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  stats?: SectionHeaderStats;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  action,
  stats,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex-1">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {description}
              </p>
            )}
          </div>
          {stats && (
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">
                {stats.total} {stats.total === 1 ? 'cita' : 'citas'}
              </span>
              {stats.currentCount !== undefined &&
                stats.currentCount !== stats.total && (
                  <span className="text-gray-400 dark:text-gray-500">
                    ({stats.currentCount} en esta página)
                  </span>
                )}
              {stats.totalPages > 1 && (
                <span className="text-gray-400 dark:text-gray-500">
                  | Página {stats.currentPage} / {stats.totalPages}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
