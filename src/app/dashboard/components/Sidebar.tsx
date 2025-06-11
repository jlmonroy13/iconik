'use client'

import { usePathname } from 'next/navigation'
import { NavLink } from './NavLink'
import { NAVIGATION_ITEMS } from '@/lib/routes'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const sidebarClasses = `
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:inset-0
    fixed inset-y-0 left-0 z-50 w-64
    bg-white dark:bg-gray-800
    border-r border-gray-200 dark:border-gray-700
    shadow-lg lg:shadow-xl
    flex flex-col h-full
    transition-transform duration-300 ease-in-out
  `

  return (
    <div className={sidebarClasses}>
      {/* Sidebar Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💅</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Iconik
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight hidden sm:block">
                Bella Nails Spa
              </p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            className="lg:hidden p-1"
            onClick={onClose}
          >
            <span className="text-gray-500 hover:text-gray-700 text-xl">✕</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1">
        <div className="px-4 space-y-1">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              onClick={onClose}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="px-4 pb-4 mt-auto border-t border-gray-100 dark:border-gray-700">
        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 mt-4">
          <h3 className="text-xs font-medium text-pink-800 dark:text-pink-200">
            Plan Gratuito
          </h3>
          <p className="text-xs text-pink-600 dark:text-pink-300 mt-1">
            500MB de almacenamiento usado
          </p>
          <button className="mt-2 text-xs text-pink-700 dark:text-pink-200 hover:underline">
            Actualizar plan
          </button>
        </div>
      </div>
    </div>
  )
}
