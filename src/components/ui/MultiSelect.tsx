'use client'

import * as React from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  error?: string
  placeholder?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  label,
  error,
  placeholder = "Seleccionar opciones...",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOptions = options.filter(option => value.includes(option.value))

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={cn(
            "w-full px-3 py-2 text-sm border rounded-md transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-800",
            "min-h-[2.5rem]",
            "flex items-center flex-wrap gap-1",
            error
              ? "border-red-500 dark:border-red-400 focus:ring-red-500"
              : "",
            "cursor-pointer"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded px-2 py-1 text-sm flex items-center gap-1"
              >
                {option.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(option.value);
                  }}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 shadow-lg">
            <div className="max-h-60 overflow-auto py-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer flex items-center",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    value.includes(option.value) &&
                      "bg-pink-50 dark:bg-pink-900/20"
                  )}
                  onClick={() => toggleOption(option.value)}
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={value.includes(option.value)}
                    onChange={() => {}}
                  />
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
