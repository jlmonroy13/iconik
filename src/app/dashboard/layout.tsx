'use client'

import { useState, type ReactNode } from 'react'
import { DashboardHeader, Sidebar } from './components'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSidebarOpen = () => setSidebarOpen(true)
  const handleSidebarClose = () => setSidebarOpen(false)

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
          <DashboardHeader onMenuToggle={handleSidebarOpen} />

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
