import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  active?: boolean
  label?: React.ReactNode
  labelAdornment?: React.ReactNode
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, active = false, value, label, labelAdornment, id, ...props }, ref) => {
    const isPlaceholder = value === '' || value === undefined
    const reactId = React.useId()
    const selectId = id || `select-${reactId}`
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {labelAdornment}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            className={cn(
              'w-full px-3 py-2 pr-10 text-sm border rounded-md transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-800 appearance-none',
              isPlaceholder ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100',
              active && 'border-pink-300 dark:border-pink-600 bg-pink-50 dark:bg-pink-900/10 text-gray-900 dark:text-white ring-1 ring-pink-200 dark:ring-pink-800',
              className
            )}
            ref={ref}
            value={value}
            {...props}
          >
            {children}
          </select>
          <svg
            className="pointer-events-none absolute right-3 h-5 w-5 text-gray-500 dark:text-gray-300"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    )
  }
)
Select.displayName = 'Select'
