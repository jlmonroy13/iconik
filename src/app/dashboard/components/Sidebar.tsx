'use client'

import { usePathname } from 'next/navigation'
import { NavLink } from './NavLink'
import { NAVIGATION_ITEMS } from '@/lib/routes'
import { IconButton, Button } from '@/components/ui'
import { Gem, X } from 'lucide-react'

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
        <div className="flex items-center justify-between h-8">
          <div className="flex items-center space-x-2">
            <Gem className="w-5 h-5 text-pink-500" />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Iconik
            </h1>
          </div>
          {/* Close button for mobile */}
          <IconButton
            variant="ghost"
            size="sm"
            icon={<X className="w-5 h-5" />}
            onClick={onClose}
            label="Cerrar menú"
            className="lg:hidden"
          />
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
          <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-xs">
            Actualizar plan
          </Button>
        </div>
      </div>
    </div>
  )
}
