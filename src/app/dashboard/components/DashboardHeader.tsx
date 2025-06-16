import { Button, Avatar, IconButton } from '@/components/ui'

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
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <IconButton
              variant="ghost"
              size="md"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              }
              onClick={onMenuToggle}
              label="Abrir menú"
              className="lg:hidden"
            />

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

            <Avatar
              fallback="M"
              alt="Usuario"
              size="md"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
