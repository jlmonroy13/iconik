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
            <button
              className="lg:hidden p-1"
              onClick={onMenuToggle}
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
              <span className="hidden sm:inline">{actionLabel}</span>
              <span className="sm:hidden">{actionMobileLabel}</span>
            </button>

            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">M</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
