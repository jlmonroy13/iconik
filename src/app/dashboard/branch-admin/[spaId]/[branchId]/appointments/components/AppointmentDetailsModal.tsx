'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, Badge, Button, Textarea } from '@/components/ui';
import type { AppointmentWithDetails, AppointmentStatus } from '@/types';
import { preConfirmAppointment } from '../actions';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentWithDetails | null;
  onEdit?: (appointment: AppointmentWithDetails) => void;
  spaId: string;
  branchId: string;
}

export function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onEdit,
  spaId,
  branchId,
}: AppointmentDetailsModalProps) {
  const router = useRouter();
  const [isPreConfirming, setIsPreConfirming] = useState(false);
  const [preConfirmNotes, setPreConfirmNotes] = useState('');
  const [showPreConfirmForm, setShowPreConfirmForm] = useState(false);

  if (!appointment) return null;

  // Status badge configuration
  const getStatusBadge = (status: AppointmentStatus) => {
    const config: Record<
      AppointmentStatus,
      {
        variant:
          | 'default'
          | 'primary'
          | 'secondary'
          | 'success'
          | 'warning'
          | 'destructive';
        label: string;
      }
    > = {
      PENDING_APPROVAL: {
        variant: 'warning',
        label: 'Pendiente de Aprobación',
      },
      SCHEDULED: { variant: 'primary', label: 'Agendada' },
      IN_PROGRESS: { variant: 'success', label: 'En Progreso' },
      COMPLETED: { variant: 'default', label: 'Completada' },
      CANCELLED: { variant: 'destructive', label: 'Cancelada' },
      NO_SHOW: { variant: 'warning', label: 'No Asistió' },
    };

    const { variant, label } = config[status];
    return (
      <Badge variant={variant} className="text-sm px-3 py-1.5 font-semibold">
        {label}
      </Badge>
    );
  };

  // Calculate totals
  const totalPrice = appointment.services.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = appointment.services.reduce(
    (sum, s) => sum + s.estimatedDuration,
    0
  );
  const estimatedEndTime = new Date(
    new Date(appointment.scheduledAt).getTime() + totalDuration * 60000
  );

  // Check if can edit
  const canEdit =
    appointment.status !== 'COMPLETED' &&
    appointment.status !== 'CANCELLED' &&
    appointment.status !== 'NO_SHOW';

  // Check if appointment is in the future (at least 2 hours ahead)
  const scheduledTime = new Date(appointment.scheduledAt);
  const now = new Date();
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const isFutureAppointment = scheduledTime >= twoHoursFromNow;

  // Calculate when pre-confirmation will be available (2 hours before appointment)
  const preConfirmationAvailableAt = new Date(
    scheduledTime.getTime() - 2 * 60 * 60 * 1000
  );

  // Handle pre-confirmation
  const handlePreConfirm = async () => {
    if (!isFutureAppointment) {
      alert('No se puede pre-confirmar una cita que es en menos de 2 horas');
      return;
    }

    setIsPreConfirming(true);
    try {
      const result = await preConfirmAppointment(
        appointment.id,
        spaId,
        branchId,
        { notes: preConfirmNotes || undefined }
      );

      if (!result.success) {
        alert(result.error || 'Error al pre-confirmar la cita');
      } else {
        setShowPreConfirmForm(false);
        setPreConfirmNotes('');
        // Refresh the page to show updated data
        router.refresh();
      }
    } catch (_error) {
      alert('Error inesperado al pre-confirmar la cita');
    } finally {
      setIsPreConfirming(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Cita"
      description={
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Cita #{appointment.id.slice(0, 8).toUpperCase()} • Creada el{' '}
            {new Intl.DateTimeFormat('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }).format(new Date(appointment.createdAt))}
          </span>
          {getStatusBadge(appointment.status)}
        </div>
      }
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          {canEdit && onEdit && (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onEdit(appointment);
                onClose();
              }}
            >
              Editar Cita
            </Button>
          )}
          {appointment.status === 'COMPLETED' && (
            <Button type="button" variant="primary" onClick={() => {}}>
              Ver Pagos
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col min-h-0 h-full overflow-y-auto space-y-4 pr-2 -mr-2">
        {/* Client Information */}
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-2.5">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Información del Cliente
          </h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Nombre
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {appointment.client.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Teléfono
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {appointment.client.phone}
              </p>
            </div>
            {appointment.client.email && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {appointment.client.email}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Documento
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {appointment.client.documentType}{' '}
                {appointment.client.documentNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Information */}
        <div className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-2.5">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Información de la Cita
          </h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Fecha
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Intl.DateTimeFormat('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(new Date(appointment.scheduledAt))}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Hora de Inicio
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Intl.DateTimeFormat('es-ES', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                }).format(new Date(appointment.scheduledAt))}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Duración Total
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {totalDuration} minutos
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Hora Estimada de Fin
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Intl.DateTimeFormat('es-ES', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                }).format(estimatedEndTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          <h4 className="text-base font-semibold text-gray-900 dark:text-white">
            Servicios ({appointment.services.length})
          </h4>
          <div className="space-y-3">
            {appointment.services.map((service, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex items-center gap-4 flex-wrap text-sm">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Servicio
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {service.service.name}
                    </span>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Manicurista
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {service.manicurist.name}
                    </span>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Duración
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {service.estimatedDuration} min
                    </span>
                  </div>
                  <span className="flex-1"></span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${service.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-Confirmation Section - Show for all scheduled appointments */}
        {appointment.status === 'SCHEDULED' && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Pre-Confirmación
            </h4>
            {appointment.preConfirmedAt ? (
              <div className="rounded-lg p-2.5 border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="success" className="text-xs">
                    Pre-Confirmada
                  </Badge>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {new Intl.DateTimeFormat('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: 'numeric',
                      minute: '2-digit',
                    }).format(new Date(appointment.preConfirmedAt))}
                  </span>
                  {appointment.preConfirmationNotes && (
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      • {appointment.preConfirmationNotes}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg p-2.5 border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                {!showPreConfirmForm ? (
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Badge variant="warning" className="text-xs">
                      Pendiente
                    </Badge>
                    <div className="flex items-center gap-2">
                      {!isFutureAppointment && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Disponible{' '}
                          {new Intl.DateTimeFormat('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: 'numeric',
                            minute: '2-digit',
                          }).format(preConfirmationAvailableAt)}{' '}
                          (2h antes)
                        </span>
                      )}
                      {isFutureAppointment && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Lista para pre-confirmar
                        </span>
                      )}
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => setShowPreConfirmForm(true)}
                        disabled={!isFutureAppointment}
                      >
                        Pre-Confirmar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Notas de pre-confirmación (opcional)"
                      value={preConfirmNotes}
                      onChange={e => setPreConfirmNotes(e.target.value)}
                      rows={2}
                      maxLength={500}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handlePreConfirm}
                        disabled={isPreConfirming || !isFutureAppointment}
                        className="flex-1"
                      >
                        {isPreConfirming ? 'Confirmando...' : 'Confirmar'}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setShowPreConfirmForm(false);
                          setPreConfirmNotes('');
                        }}
                        disabled={isPreConfirming}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {appointment.notes && (
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white">
              Notas
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {appointment.notes}
              </p>
            </div>
          </div>
        )}

        {/* Total Summary */}
        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900 dark:text-white">
              Total de la Cita
            </span>
            <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              ${totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
