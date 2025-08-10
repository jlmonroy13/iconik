'use client';

import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { type ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui';

interface UserMenuItem {
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  label?: string;
  divider?: boolean;
}

interface UserMenuProps {
  items: UserMenuItem[];
  fallback?: string;
  alt?: string;
}

export function UserMenu({
  items,
  fallback = 'U',
  alt = 'Usuario',
}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className='flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-0 active:ring-0 ring-0 outline-none'
          aria-label='Menú de usuario'
          type='button'
        >
          <Avatar fallback={fallback} alt={alt} size='md' />
          <svg
            className={cn(
              'w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform'
            )}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        {items.map((item, index) =>
          item.divider ? (
            <DropdownMenuSeparator
              key={index}
              className='my-1 border-t border-gray-200 dark:border-gray-700'
            />
          ) : item.href ? (
            <DropdownMenuItem
              asChild
              key={index}
              className='px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left flex items-center space-x-3'
            >
              <Link
                href={item.href}
                className='flex items-center space-x-3 w-full'
              >
                <span className='text-gray-500 dark:text-gray-400'>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              key={index}
              onClick={item.onClick}
              className='px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left flex items-center space-x-3'
            >
              <span className='text-gray-500 dark:text-gray-400'>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
