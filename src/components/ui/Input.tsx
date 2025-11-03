import * as React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  active?: boolean;
  label?: React.ReactNode;
  labelAdornment?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      active = false,
      value,
      onChange,
      disabled,
      label,
      labelAdornment,
      id,
      error,
      ...props
    },
    ref
  ) => {
    const isDate = ['date', 'datetime-local', 'time'].includes(type);
    const isEmpty = !value || value === '';
    const showClear =
      isDate && !isEmpty && !disabled && typeof onChange === 'function';
    const reactId = React.useId();
    const inputId = id || `input-${reactId}`;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onChange) {
        const event = {
          ...e,
          target: { value: '', name: props.name },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    const handleContainerClick = (e: React.MouseEvent) => {
      // If clicking on the container (not the clear button), open the picker
      if (isDate && inputRef.current && !disabled) {
        const target = e.target as HTMLElement;
        // Only trigger if clicking on the container or icon area, not the clear button
        if (
          target.closest('button')?.getAttribute('type') !== 'button' ||
          !target.closest('button')
        ) {
          inputRef.current.showPicker?.();
        }
      }
    };

    return (
      <div
        className={cn('relative w-full overflow-visible')}
        onClick={handleContainerClick}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
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
            'w-full px-3 py-2 text-sm border rounded-md transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-800 box-border',
            {
              '!border-red-500 dark:!border-red-400 focus:ring-red-500':
                !!error,
            },
            active &&
              'border-pink-300 dark:border-pink-600 bg-pink-50 dark:bg-pink-900/10 ring-1 ring-pink-200 dark:ring-pink-800',
            isDate && isEmpty && 'text-gray-400 dark:text-gray-500',
            isDate && !isEmpty && 'text-gray-900 dark:text-white',
            isDate && 'datetime-picker-hack',
            className
          )}
          ref={combinedRef}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        {/* Custom white calendar icon overlay for date and datetime-local */}
        {(type === 'date' || type === 'datetime-local' || type === 'time') && (
          <span className="pointer-events-none flex items-center absolute right-3 bottom-3">
            {type === 'time' ? (
              <Clock
                className={cn('h-4 w-4', {
                  'text-white': !error,
                  'text-red-500 dark:text-red-400': !!error,
                })}
              />
            ) : (
              <Calendar
                className={cn('h-4 w-4', {
                  'text-white': !error,
                  'text-red-500 dark:text-red-400': !!error,
                })}
              />
            )}
          </span>
        )}
        {error && (
          <p className="mt-1 text-sm font-medium text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
        {showClear && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-8 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors bottom-2 z-10"
            onClick={handleClear}
            aria-label="Limpiar fecha"
          >
            <svg
              className="h-4 w-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l8 8M6 14L14 6"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
