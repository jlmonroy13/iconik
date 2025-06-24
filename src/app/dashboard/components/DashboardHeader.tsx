'use client'

import { IconButton, UserMenu } from '@/components/ui'
import { Menu, Settings, UserCircle, LogOut } from 'lucide-react'

interface DashboardHeaderProps {
  onMenuToggle: () => void
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const userMenuItems = [
    {
      href: '/dashboard/settings',
      icon: <Settings className="h-4 w-4" />,
      label: 'Configuración'
    },
    {
      href: '/dashboard/profile',
      icon: <UserCircle className="h-4 w-4" />,
      label: 'Perfil'
    },
    {
      divider: true
    },
    {
      onClick: () => {
        console.log('Logout clicked')
      },
      icon: <LogOut className="h-4 w-4" />,
      label: 'Cerrar sesión'
    }
  ]

  return (
    <header className="flex-shrink-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="mr-2 lg:hidden">
              <IconButton
                icon={<Menu className="h-6 w-6" />}
                onClick={onMenuToggle}
                aria-label="Open sidebar"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <UserMenu items={userMenuItems} fallback="M" alt="Usuario" />
          </div>
        </div>
      </div>
    </header>
  );
}
