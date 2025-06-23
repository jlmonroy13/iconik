import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  active?: boolean
  label?: React.ReactNode
  labelAdornment?: React.ReactNode
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', active = false, value, onChange, disabled, label, labelAdornment, id, error, ...props }, ref) => {
    const isDate = type === 'date'
    const isEmpty = !value || value === ''
    const showClear = isDate && !isEmpty && !disabled && typeof onChange === 'function'
    const reactId = React.useId()
    const inputId = id || `input-${reactId}`

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault()
      if (onChange) {
        const event = {
          ...e,
          target: { value: '', name: props.name },
        } as unknown as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
    }

    return (
      <div className={cn('relative w-full')}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <span className="flex items-center">
              {label}
              {labelAdornment && <span className="ml-2">{labelAdornment}</span>}
            </span>
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            'w-full px-3 py-2 text-sm border rounded-md transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-800',
            {
              'border-red-500 dark:border-red-400 focus:ring-red-500': !!error,
            },
            active && 'border-pink-300 dark:border-pink-600 bg-pink-50 dark:bg-pink-900/10 ring-1 ring-pink-200 dark:ring-pink-800',
            isDate && isEmpty && 'text-gray-400 dark:text-gray-500',
            isDate && active && !isEmpty && 'text-white dark:text-white',
            isDate && '[&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:dark:invert',
            className
          )}
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm font-medium text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
        {showClear && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            onClick={handleClear}
            aria-label="Limpiar fecha"
          >
            <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M6 14L14 6" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
