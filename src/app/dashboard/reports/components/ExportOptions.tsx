'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

export function ExportOptions() {
  const [isOpen, setIsOpen] = useState(false)

  const exportData = (format: 'pdf' | 'excel' | 'csv') => {
    // TODO: Implement actual export functionality
    console.log(`Exporting as ${format}`)
    setIsOpen(false)

    // Simulate export
    const link = document.createElement('a')
    link.href = '#'
    link.download = `reporte-${new Date().toISOString().split('T')[0]}.${format}`
    link.click()
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <span>📊</span>
        <span className="hidden sm:inline">Exportar</span>
        <span className="sm:hidden">Export</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <div className="p-2 space-y-1">
            <button
              onClick={() => exportData('pdf')}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
            >
              <span className="text-lg">📄</span>
              <span>Exportar PDF</span>
            </button>
            <button
              onClick={() => exportData('excel')}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
            >
              <span className="text-lg">📊</span>
              <span>Exportar Excel</span>
            </button>
            <button
              onClick={() => exportData('csv')}
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
            >
              <span className="text-lg">📋</span>
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
