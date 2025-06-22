'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar } from './Avatar'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface UserMenuItem {
  href?: string
  onClick?: () => void
  icon?: string
  label?: string
  divider?: boolean
}

interface UserMenuProps {
  items: UserMenuItem[]
  fallback?: string
  alt?: string
}

export function UserMenu({ items, fallback = "U", alt = "Usuario" }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => setIsOpen(!isOpen)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        aria-label="Menú de usuario"
      >
        <Avatar
          fallback={fallback}
          alt={alt}
          size="md"
        />
        <svg
          className={cn(
            "w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          {items.map((item, index) => (
            <div key={index}>
              {item.divider && (
                <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              )}
              {!item.divider && item.href && (
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}
              {!item.divider && item.onClick && (
                <button
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
