import { Button, UserMenu } from '@/components/ui'

interface DashboardHeaderProps {
  onMenuToggle: () => void
  title: string
  subtitle: string
  actionLabel: string
  actionMobileLabel: string
}

export function DashboardHeader({
  onMenuToggle,
  title,
  subtitle,
  actionLabel,
  actionMobileLabel
}: DashboardHeaderProps) {
  const userMenuItems = [
    {
      href: '/dashboard/settings',
      icon: '⚙️',
      label: 'Configuración'
    },
    {
      href: '/dashboard/profile',
      icon: '👤',
      label: 'Perfil'
    },
    {
      divider: true
    },
    {
      onClick: () => {
        // TODO: Implement logout functionality
        console.log('Logout clicked')
      },
      icon: '🚪',
      label: 'Cerrar sesión'
    }
  ]

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                {title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block leading-tight">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="primary" size="sm" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">{actionLabel}</span>
              <span className="sm:hidden">{actionMobileLabel}</span>
            </Button>

            <UserMenu
              items={userMenuItems}
              fallback="M"
              alt="Usuario"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
