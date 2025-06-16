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
}

// Function to get icon container color based on icon content
const getIconContainerColor = (icon: React.ReactNode): string => {
  if (typeof icon === 'string') {
    switch (icon) {
      case '💅':
        return 'bg-pink-100 dark:bg-pink-900/20'
      case '💰':
        return 'bg-green-100 dark:bg-green-900/20'
      case '👥':
        return 'bg-blue-100 dark:bg-blue-900/20'
      case '📅':
        return 'bg-purple-100 dark:bg-purple-900/20'
      case '📊':
        return 'bg-orange-100 dark:bg-orange-900/20'
      case '⭐':
        return 'bg-yellow-100 dark:bg-yellow-900/20'
      default:
        return 'bg-gray-100 dark:bg-gray-700'
    }
  }
  return 'bg-gray-100 dark:bg-gray-700'
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ title, value, mobileValue, icon, description, trend, className, ...props }, ref) => {
    const iconContainerColor = getIconContainerColor(icon)

    return (
      <Card
        ref={ref}
        className={cn("p-4 sm:p-6", className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {mobileValue ? (
                <>
                  <span className="hidden sm:inline">{value}</span>
                  <span className="sm:hidden">{mobileValue}</span>
                </>
              ) : (
                value
              )}
            </p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
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
          <div className={cn(
            "w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-4",
            iconContainerColor
          )}>
            <div className="text-lg sm:text-2xl">
              {icon}
            </div>
          </div>
        </div>
      </Card>
    )
  }
)
StatCard.displayName = "StatCard"

export { StatCard }
