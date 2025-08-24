'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-medium text-gray-700 dark:text-gray-300',
        className
      )}
      {...props}
    />
  );
});

Label.displayName = 'Label';

export { Label };
