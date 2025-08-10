import * as React from 'react';
import CurrencyInputBase, {
  CurrencyInputProps as BaseProps,
} from 'react-currency-input-field';
import { cn } from '@/lib/utils';

export interface CurrencyInputProps
  extends Omit<BaseProps, 'onChange' | 'value'> {
  label?: React.ReactNode;
  labelAdornment?: React.ReactNode;
  error?: string;
  value?: string | number;
  onChange?: (value: number | undefined) => void;
  name?: string;
  className?: string;
}

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(
  (
    {
      label,
      labelAdornment,
      error,
      value,
      onChange,
      name,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative w-full')}>
        {label && (
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            <span className='flex items-center'>
              {label}
              {labelAdornment && <span className='ml-2'>{labelAdornment}</span>}
            </span>
          </label>
        )}
        <CurrencyInputBase
          id={name}
          name={name}
          className={cn(
            'w-full px-3 py-2 text-sm border rounded-md transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-800',
            error && 'border-red-500 dark:border-red-400 focus:ring-red-500',
            className
          )}
          decimalsLimit={0}
          decimalSeparator=',' // Para formato colombiano
          groupSeparator='.'
          prefix='$ '
          value={value}
          onValueChange={val => {
            if (onChange) {
              const num = val
                ? parseFloat(val.replace(/\./g, '').replace(',', '.'))
                : undefined;
              onChange(isNaN(num as number) ? undefined : num);
            }
          }}
          ref={ref}
          {...props}
        />
        {error && (
          <p className='mt-1 text-sm font-medium text-red-500 dark:text-red-400'>
            {error}
          </p>
        )}
      </div>
    );
  }
);
CurrencyInput.displayName = 'CurrencyInput';
