import React from 'react'
import { cn } from '@/lib/utils'
import { Card } from './Card'

export interface StatCardProps {
  title: string
  value: React.ReactNode
  mobileValue?: React.ReactNode
  icon: React.ReactNode
  description?: string
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
  iconBgColor?: string
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, mobileValue, icon, description, trend, className, iconBgColor = 'bg-gray-100 dark:bg-gray-700', ...props }, ref) => {

    return (
      <Card
        ref={ref}
        className={cn("p-4 sm:p-6 flex flex-col", className)}
        {...props}
      >
        <div className="flex items-center justify-between flex-grow">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 h-10 mb-1">
              {title}
            </p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              {mobileValue ? (
                <>
                  <span className="hidden sm:inline">{value}</span>
                  <span className="sm:hidden">{mobileValue}</span>
                </>
              ) : (
                value
              )}
            </p>
          </div>
          <div className={cn(
            "w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-4",
            iconBgColor
          )}>
            <div className="text-lg sm:text-2xl">
              {icon}
            </div>
          </div>
        </div>
        {(description || trend) && (
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
            {description && !trend && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
        )}
      </Card>
    )
  }
)
StatCard.displayName = "StatCard"

export { StatCard }
