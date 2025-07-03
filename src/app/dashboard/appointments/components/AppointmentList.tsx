'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, Button } from '@/components/ui'
import { Eye, Pencil, Trash2, X, Calendar, Wand2, Hand, Footprints, Brush, Sparkles, Gem, Wrench, SprayCan, Bath } from 'lucide-react'
import type { AppointmentWithDetails } from '@/types'

interface AppointmentListProps {
  appointments: AppointmentWithDetails[]
  onEdit: (appointment: AppointmentWithDetails) => void
  onDelete: (appointment: AppointmentWithDetails) => void
}

export function AppointmentList({ appointments, onEdit, onDelete }: AppointmentListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SCHEDULED: { text: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
      CONFIRMED: { text: 'Confirmada', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
      COMPLETED: { text: 'Completada', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
      CANCELLED: { text: 'Cancelada', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SCHEDULED
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    )
  }

  const getServiceTypeIcon = (serviceType: string, className = "w-6 h-6") => {
    const iconProps = { className }
    switch (serviceType) {
      case 'MANICURE': return <Hand {...iconProps} />;
      case 'PEDICURE': return <Footprints {...iconProps} />;
      case 'NAIL_ART': return <Brush {...iconProps} />;
      case 'GEL_POLISH': return <Sparkles {...iconProps} />;
      case 'ACRYLIC_NAILS': return <Gem {...iconProps} />;
      case 'NAIL_REPAIR': return <Wrench {...iconProps} />;
      case 'HAND_SPA': return <SprayCan {...iconProps} />;
      case 'FOOT_SPA': return <Bath {...iconProps} />;
      default: return <Wand2 {...iconProps} />;
    }
  }

  const handleDelete = (appointment: AppointmentWithDetails) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      onDelete(appointment)
    }
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400" />
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">
          No hay citas programadas
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Comienza creando tu primera cita
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {appointments.map((appointment) => {
        // Calculate total price from services
        const totalPrice = appointment.services.reduce((sum, service) => sum + service.price, 0)
        // Get primary service for display (first service)
        const primaryService = appointment.services[0]

        return (
          <Card key={appointment.id} className="shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {primaryService && getServiceTypeIcon(primaryService.service.type, "w-8 h-8")}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {appointment.client.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {primaryService ? primaryService.service.name : 'Sin servicios'}
                      {appointment.services.length > 1 && ` +${appointment.services.length - 1} más`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {getStatusBadge(appointment.status)}
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(totalPrice)}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(appointment.scheduledAt), "PPP, p")}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onEdit(appointment)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handleDelete(appointment)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

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
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                {selectedAppointment.services[0] && getServiceTypeIcon(
                  selectedAppointment.services[0].service.type,
                  "w-10 h-10"
                )}
                <div>
                  <div className="font-medium text-lg">
                    {selectedAppointment.services[0]?.service.name || 'Sin servicios'}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {selectedAppointment.client.name}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Fecha:
                  </span>
                  <div className="text-gray-900 dark:text-white">
                    {format(new Date(selectedAppointment.scheduledAt), "PPP")}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Hora:
                  </span>
                  <div className="text-gray-900 dark:text-white">
                    {format(new Date(selectedAppointment.scheduledAt), "HH:mm")}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Servicios:
                  </span>
                  <div className="text-gray-900 dark:text-white">
                    {selectedAppointment.services.length} servicio{selectedAppointment.services.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Precio Total:
                  </span>
                  <div className="text-gray-900 dark:text-white font-medium">
                    {formatCurrency(selectedAppointment.services.reduce((sum, service) => sum + service.price, 0))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Estado:
                  </span>
                  <div className="mt-1">
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                </div>
                {selectedAppointment.manicurist && (
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Manicurista:
                    </span>
                    <div className="text-gray-900 dark:text-white">
                      {selectedAppointment.manicurist.name}
                    </div>
                  </div>
                )}
              </div>

              {selectedAppointment.notes && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Notas:
                  </span>
                  <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}

              {/* Services breakdown */}
              {selectedAppointment.services.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Servicios:
                  </span>
                  <div className="mt-2 space-y-2">
                    {selectedAppointment.services.map((service) => (
                      <div key={service.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-gray-900 dark:text-white">
                          {service.service.name}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedAppointment(null)}
              >
                Cerrar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  onEdit(selectedAppointment)
                  setSelectedAppointment(null)
                }}
              >
                Editar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
