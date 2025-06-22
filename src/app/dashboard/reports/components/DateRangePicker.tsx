'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'

export function DateRangePicker() {
  const [isOpen, setIsOpen] = useState(false)
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  })

  const handleDateChange = (key: 'from' | 'to', value: string) => {
    setDateRange(prev => ({ ...prev, [key]: value }))
  }

  const setQuickRange = (days: number) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)

    setDateRange({
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0]
    })
  }

  const clearRange = () => {
    setDateRange({ from: '', to: '' })
  }

  const hasActiveRange = dateRange.from || dateRange.to

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <span>📅</span>
        <span className="hidden sm:inline">
          {hasActiveRange ? `${dateRange.from} - ${dateRange.to}` : 'Rango de fechas'}
        </span>
        <span className="sm:hidden">Fechas</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Rango de Fechas
              </h3>
              {hasActiveRange && (
                <button
                  onClick={clearRange}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => handleDateChange('to', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickRange(7)}
                className="text-xs"
              >
                Últimos 7 días
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickRange(30)}
                className="text-xs"
              >
                Últimos 30 días
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickRange(90)}
                className="text-xs"
              >
                Últimos 90 días
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const now = new Date()
                  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
                  setDateRange({
                    from: startOfMonth.toISOString().split('T')[0],
                    to: now.toISOString().split('T')[0]
                  })
                }}
                className="text-xs"
              >
                Este mes
              </Button>
            </div>

            <Button
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Aplicar Filtro
            </Button>
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
