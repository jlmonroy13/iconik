'use client'

import { useState } from 'react'

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button - Mobile Only */}
      <div className="fixed bottom-4 right-4 z-40 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105"
        >
          <span className="text-2xl">+</span>
        </button>
      </div>

      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 lg:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 space-y-2">
            <button
              onClick={() => {
                setIsOpen(false)
                // TODO: Open new appointment modal
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
            >
              <span className="text-lg">📅</span>
              <span>Nueva Cita</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false)
                // TODO: Open quick schedule modal
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
            >
              <span className="text-lg">⚡</span>
              <span>Agenda Rápida</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false)
                // TODO: Open client selection
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
            >
              <span className="text-lg">👥</span>
              <span>Nuevo Cliente</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
