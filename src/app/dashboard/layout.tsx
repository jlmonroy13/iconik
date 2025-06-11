'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardHeader, Sidebar } from './components'
import { HEADER_CONFIG, ROUTES } from '@/lib/routes'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const handleSidebarOpen = () => setSidebarOpen(true)
  const handleSidebarClose = () => setSidebarOpen(false)

  // Get header configuration for current route with fallback
  const currentConfig = HEADER_CONFIG[pathname as keyof typeof HEADER_CONFIG] || HEADER_CONFIG[ROUTES.DASHBOARD]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={handleSidebarClose}
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
          </div>
        )}

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden lg:ml-0">
          {/* Header */}
          <DashboardHeader
            onMenuToggle={handleSidebarOpen}
            title={currentConfig.title}
            subtitle={currentConfig.subtitle}
            actionLabel={currentConfig.action.label}
            actionMobileLabel={currentConfig.action.mobileLabel}
          />

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
