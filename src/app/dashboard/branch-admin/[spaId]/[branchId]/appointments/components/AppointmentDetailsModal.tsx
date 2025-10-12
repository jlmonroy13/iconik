'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Modal, Badge, Button } from '@/components/ui';
import type { AppointmentWithDetails, AppointmentStatus } from '@/types';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentWithDetails | null;
  onEdit?: (appointment: AppointmentWithDetails) => void;
}

export function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
  onEdit,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null;

  // Status badge configuration
  const getStatusBadge = (status: AppointmentStatus) => {
    const config: Record<
      AppointmentStatus,
      {
        variant: 'default' | 'success' | 'warning' | 'error' | 'info';
        label: string;
      }
    > = {
      PENDING_APPROVAL: {
        variant: 'warning',
        label: 'Pendiente de Aprobación',
      },
      SCHEDULED: { variant: 'info', label: 'Agendada' },
      IN_PROGRESS: { variant: 'success', label: 'En Progreso' },
      COMPLETED: { variant: 'default', label: 'Completada' },
      CANCELLED: { variant: 'error', label: 'Cancelada' },
      NO_SHOW: { variant: 'warning', label: 'No Asistió' },
    };

    const { variant, label } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Cita"
      size="large"
    >
      <div className="space-y-6">
        {/* Header with Status */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Cita #{appointment.id.slice(0, 8).toUpperCase()}
            </h3>
            <p className="text-sm text-gray-500">
              Creada el{' '}
              {format(
                new Date(appointment.createdAt),
                "dd 'de' MMMM 'de' yyyy",
                { locale: es }
              )}
            </p>
          </div>
          {getStatusBadge(appointment.status)}
        </div>

        {/* Client Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Información del Cliente
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Nombre</p>
              <p className="text-sm font-medium text-gray-900">
                {appointment.client.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Teléfono</p>
              <p className="text-sm font-medium text-gray-900">
                {appointment.client.phone}
              </p>
            </div>
            {appointment.client.email && (
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {appointment.client.email}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Documento</p>
              <p className="text-sm font-medium text-gray-900">
                {appointment.client.documentType}{' '}
                {appointment.client.documentNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Information */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Información de la Cita
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Tipo de Cita</p>
              <p className="text-sm font-medium text-gray-900">
                {appointment.isScheduled ? (
                  'Agendada'
                ) : (
                  <span className="text-amber-600">Walk-in</span>
                )}
              </p>
            </div>
            {appointment.branch && (
              <div>
                <p className="text-xs text-gray-500">Sede</p>
                <p className="text-sm font-medium text-gray-900">
                  {appointment.branch.name}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Fecha</p>
              <p className="text-sm font-medium text-gray-900">
                {format(
                  new Date(appointment.scheduledAt),
                  "dd 'de' MMMM 'de' yyyy",
                  {
                    locale: es,
                  }
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Hora de Inicio</p>
              <p className="text-sm font-medium text-gray-900">
                {format(new Date(appointment.scheduledAt), 'HH:mm')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Duración Total</p>
              <p className="text-sm font-medium text-gray-900">
                {totalDuration} minutos
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Hora Estimada de Fin</p>
              <p className="text-sm font-medium text-gray-900">
                {format(estimatedEndTime, 'HH:mm')}
              </p>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Servicios ({appointment.services.length})
          </h4>
          <div className="space-y-3">
            {appointment.services.map((service, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {service.service.name}
                    </h5>
                    <p className="text-sm text-gray-500">
                      {service.service.type.replace('_', ' ')}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    ${service.price.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Manicurista</p>
                    <p className="text-sm font-medium text-gray-900">
                      {service.manicurist.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duración</p>
                    <p className="text-sm font-medium text-gray-900">
                      {service.estimatedDuration} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">
              Total de la Cita
            </span>
            <span className="text-2xl font-bold text-gray-900">
              ${totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Notas</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {appointment.notes}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
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
      </div>
    </Modal>
  );
}
