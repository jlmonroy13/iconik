'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui'
import type { Appointment } from '../types'

interface AppointmentListProps {
  appointments: Appointment[]
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SCHEDULED: { label: 'Programada', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
      CONFIRMED: { label: 'Confirmada', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
      IN_PROGRESS: { label: 'En Progreso', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' },
      COMPLETED: { label: 'Completada', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' },
      CANCELLED: { label: 'Cancelada', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' },
      NO_SHOW: { label: 'No Asistió', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SCHEDULED

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getServiceTypeIcon = (serviceType: string) => {
    const icons = {
      MANICURE: '💅',
      PEDICURE: '🦶',
      NAIL_ART: '🎨',
      GEL_POLISH: '✨',
      ACRYLIC_NAILS: '💎',
      NAIL_REPAIR: '🔧',
      HAND_SPA: '🧴',
      FOOT_SPA: '🛁',
      OTHER: '💫'
    }
    return icons[serviceType as keyof typeof icons] || '💫'
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="text-4xl sm:text-6xl mb-4">📅</div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay citas programadas
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Comienza creando tu primera cita
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-6">
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex items-start gap-3">
                <div className="text-xl sm:text-2xl flex-shrink-0">
                  {getServiceTypeIcon(appointment.serviceType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {appointment.client.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {appointment.serviceType.replace('_', ' ')}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">📅</span>
                      <span className="text-gray-900 dark:text-white">
                        {format(new Date(appointment.scheduledAt), 'PPP')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">🕐</span>
                      <span className="text-gray-900 dark:text-white">
                        {format(new Date(appointment.scheduledAt), 'HH:mm')} ({appointment.duration} min)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">💰</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatCurrency(appointment.price)}
                      </span>
                    </div>
                    {appointment.manicurist && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">✨</span>
                        <span className="text-gray-900 dark:text-white">
                          {appointment.manicurist.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {appointment.notes && (
                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {appointment.notes}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setSelectedAppointment(appointment)}
                      className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Ver Detalles
                    </button>
                    <button className="flex-1 px-3 py-2 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-start justify-between">
              {/* Left side - Appointment details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">
                    {getServiceTypeIcon(appointment.serviceType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                      {appointment.serviceType.replace('_', ' ')} - {appointment.client.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.manicurist?.name || 'Sin asignar'}
                    </p>
                  </div>
                </div>

                {/* Appointment details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">📅</span>
                    <span className="text-gray-900 dark:text-white">
                      {format(new Date(appointment.scheduledAt), 'PPP')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">🕐</span>
                    <span className="text-gray-900 dark:text-white">
                      {format(new Date(appointment.scheduledAt), 'HH:mm')} ({appointment.duration} min)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">💰</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatCurrency(appointment.price)}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Right side - Status and actions */}
              <div className="flex flex-col items-end gap-3 ml-4">
                {getStatusBadge(appointment.status)}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedAppointment(appointment)}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Ver
                  </button>
                  <button
                    className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Appointment detail modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Detalles de la Cita
              </h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getServiceTypeIcon(selectedAppointment.serviceType)}</span>
                <div>
                  <div className="font-medium">{selectedAppointment.serviceType.replace('_', ' ')}</div>
                  <div className="text-gray-500 dark:text-gray-400">{selectedAppointment.client.name}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Fecha:</span>
                  <div className="text-gray-900 dark:text-white">
                    {format(new Date(selectedAppointment.scheduledAt), 'PPP')}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Hora:</span>
                  <div className="text-gray-900 dark:text-white">
                    {format(new Date(selectedAppointment.scheduledAt), 'HH:mm')}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Duración:</span>
                  <div className="text-gray-900 dark:text-white">{selectedAppointment.duration} minutos</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Precio:</span>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {formatCurrency(selectedAppointment.price)}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Estado:</span>
                  <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
                </div>
                {selectedAppointment.manicurist && (
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Manicurista:</span>
                    <div className="text-gray-900 dark:text-white">{selectedAppointment.manicurist.name}</div>
                  </div>
                )}
              </div>

              {selectedAppointment.notes && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Notas:</span>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
