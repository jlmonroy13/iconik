import React from 'react'

interface DashboardSectionLayoutProps {
  icon: React.ReactNode
  title: string
  description?: string
  stats?: React.ReactNode
  actionButton?: React.ReactNode
  children: React.ReactNode
}

export function DashboardSectionLayout({
  icon,
  title,
  description,
  stats,
  actionButton,
  children,
}: DashboardSectionLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header sticky as card */}
      <div className="sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 dark:text-white">
              {title}
            </h1>
          </div>
          {actionButton && (
            <div className="flex-shrink-0">{actionButton}</div>
          )}
        </div>
        {description && (
          <p className="text-gray-400 dark:text-gray-400 mb-4 text-base">{description}</p>
        )}
        {stats && (
          <div className="pt-2">{stats}</div>
        )}
      </div>
      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
        {children}
      </div>
    </div>
  )
}
