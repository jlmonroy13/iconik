import React from 'react';
import { cn } from '@/lib/utils';

// Table component
export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

// Table header
export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        'bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700',
        className
      )}
      {...props}
    />
  );
}

// Table body
export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('bg-white dark:bg-slate-900', className)} {...props} />
  );
}

// Table footer
export function TableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        'bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 font-medium',
        className
      )}
      {...props}
    />
  );
}

// Table row
export function TableRow({
  className,
  isAlternate = false,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & {
  isAlternate?: boolean;
}) {
  return (
    <tr
      className={cn(
        'border-b border-slate-100 dark:border-slate-800 transition-colors duration-150',
        isAlternate
          ? 'bg-slate-50 dark:bg-slate-800/50'
          : 'bg-white dark:bg-slate-900',
        'hover:bg-blue-50 dark:hover:bg-blue-900/20',
        className
      )}
      {...props}
    />
  );
}

// Table head cell
export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-12 px-4 text-left align-middle font-semibold text-slate-700 dark:text-slate-200',
        className
      )}
      {...props}
    />
  );
}

// Table cell
export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('p-4 align-middle', className)} {...props} />;
}

// Table caption
export function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn(
        'mt-4 text-sm text-slate-500 dark:text-slate-400',
        className
      )}
      {...props}
    />
  );
}

// Badge component for table cells
export function TableBadge({
  variant = 'default',
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
}) {
  const variantStyles = {
    default:
      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    warning:
      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    destructive:
      'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  };

  return (
    <span
      className={cn(
        'inline-flex px-3 py-1 text-sm font-medium rounded-full',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Empty state component for tables
export function TableEmptyState({
  title,
  description,
  action,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn('p-8 text-center', className)} {...props}>
      <p className="text-slate-500 dark:text-slate-400 mb-4">{title}</p>
      {description && (
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
