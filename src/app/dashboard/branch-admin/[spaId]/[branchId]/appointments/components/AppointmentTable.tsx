'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, Badge, ItemActions, ConfirmDialog } from '@/components/ui';
import type { AppointmentWithDetails, AppointmentStatus } from '@/types';
import {
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
} from '../actions';

interface AppointmentTableProps {
  appointments: AppointmentWithDetails[];
  spaId: string;
  branchId: string;
  onEdit: (appointment: AppointmentWithDetails) => void;
  onView: (appointment: AppointmentWithDetails) => void;
}

export function AppointmentTable({
  appointments,
  spaId,
  branchId,
  onEdit,
  onView,
}: AppointmentTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Status badge colors
  const getStatusBadge = (status: AppointmentStatus) => {
    const config: Record<
      AppointmentStatus,
      {
        variant: 'default' | 'success' | 'warning' | 'error' | 'info';
        label: string;
      }
    > = {
      PENDING_APPROVAL: { variant: 'warning', label: 'Pendiente' },
      SCHEDULED: { variant: 'info', label: 'Agendada' },
      IN_PROGRESS: { variant: 'success', label: 'En Progreso' },
      COMPLETED: { variant: 'default', label: 'Completada' },
      CANCELLED: { variant: 'error', label: 'Cancelada' },
      NO_SHOW: { variant: 'warning', label: 'No Asistió' },
    };

    const { variant, label } = config[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  // Handle status change
  const handleStatusChange = async (
    appointmentId: string,
    newStatus: AppointmentStatus
  ) => {
    setActionLoading(appointmentId);
    try {
      const result = await updateAppointmentStatus(
        appointmentId,
        spaId,
        branchId,
        { status: newStatus }
      );

      if (!result.success) {
        alert(result.error || 'Error al cambiar el estado');
      }
    } catch (error) {
      console.error('Error changing status:', error);
      alert('Error inesperado al cambiar el estado');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle cancel appointment
  const handleCancel = (appointmentId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Cancelar Cita',
      message: '¿Estás seguro de que deseas cancelar esta cita?',
      onConfirm: async () => {
        setActionLoading(appointmentId);
        setConfirmDialog({ ...confirmDialog, isOpen: false });

        try {
          const result = await cancelAppointment(
            appointmentId,
            spaId,
            branchId,
            {
              reason: 'Cancelada por el administrador',
            }
          );

          if (!result.success) {
            alert(result.error || 'Error al cancelar la cita');
          }
        } catch (error) {
          console.error('Error cancelling appointment:', error);
          alert('Error inesperado al cancelar la cita');
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  // Handle delete appointment
  const handleDelete = (appointmentId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Cita',
      message:
        '¿Estás seguro de que deseas eliminar esta cita permanentemente? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setActionLoading(appointmentId);
        setConfirmDialog({ ...confirmDialog, isOpen: false });

        try {
          const result = await deleteAppointment(
            appointmentId,
            spaId,
            branchId
          );

          if (!result.success) {
            alert(result.error || 'Error al eliminar la cita');
          }
        } catch (error) {
          console.error('Error deleting appointment:', error);
          alert('Error inesperado al eliminar la cita');
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  // Get available status transitions for current status
  const getStatusActions = (currentStatus: AppointmentStatus) => {
    const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      PENDING_APPROVAL: ['SCHEDULED', 'CANCELLED'],
      SCHEDULED: ['IN_PROGRESS', 'NO_SHOW', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
      NO_SHOW: [],
    };

    const statusLabels: Record<AppointmentStatus, string> = {
      PENDING_APPROVAL: 'Pendiente',
      SCHEDULED: 'Agendar',
      IN_PROGRESS: 'Iniciar',
      COMPLETED: 'Completar',
      CANCELLED: 'Cancelar',
      NO_SHOW: 'No Asistió',
    };

    return transitions[currentStatus].map(status => ({
      status,
      label: statusLabels[status],
    }));
  };

  // Calculate totals for each appointment
  const getAppointmentTotals = (appointment: AppointmentWithDetails) => {
    const totalPrice = appointment.services.reduce(
      (sum, s) => sum + s.price,
      0
    );
    const totalDuration = appointment.services.reduce(
      (sum, s) => sum + s.estimatedDuration,
      0
    );
    return { totalPrice, totalDuration };
  };

  // Table columns
  const columns = [
    {
      header: 'Fecha y Hora',
      accessor: 'scheduledAt' as const,
      cell: (appointment: AppointmentWithDetails) => (
        <div>
          <div className="font-medium text-gray-900">
            {format(new Date(appointment.scheduledAt), 'dd MMM yyyy', {
              locale: es,
            })}
          </div>
          <div className="text-sm text-gray-500">
            {format(new Date(appointment.scheduledAt), 'HH:mm')}
          </div>
          {!appointment.isScheduled && (
            <div className="text-xs text-amber-600 mt-1">Walk-in</div>
          )}
        </div>
      ),
    },
    {
      header: 'Cliente',
      accessor: 'client' as const,
      cell: (appointment: AppointmentWithDetails) => (
        <div>
          <div className="font-medium text-gray-900">
            {appointment.client.name}
          </div>
          <div className="text-sm text-gray-500">
            {appointment.client.phone}
          </div>
        </div>
      ),
    },
    {
      header: 'Servicios',
      accessor: 'services' as const,
      cell: (appointment: AppointmentWithDetails) => (
        <div className="space-y-1">
          {appointment.services.map((service, index) => (
            <div key={index} className="text-sm">
              <span className="text-gray-900">{service.service.name}</span>
              <span className="text-gray-500">
                {' '}
                • {service.manicurist.name}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      header: 'Estado',
      accessor: 'status' as const,
      cell: (appointment: AppointmentWithDetails) =>
        getStatusBadge(appointment.status),
    },
    {
      header: 'Total',
      accessor: 'id' as const,
      cell: (appointment: AppointmentWithDetails) => {
        const { totalPrice, totalDuration } = getAppointmentTotals(appointment);
        return (
          <div>
            <div className="font-medium text-gray-900">
              ${totalPrice.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">{totalDuration} min</div>
          </div>
        );
      },
    },
    {
      header: 'Acciones',
      accessor: 'id' as const,
      cell: (appointment: AppointmentWithDetails) => {
        const statusActions = getStatusActions(appointment.status);
        const isLoading = actionLoading === appointment.id;

        const actions = [
          {
            label: 'Ver Detalles',
            onClick: () => onView(appointment),
          },
          ...(appointment.status !== 'COMPLETED' &&
          appointment.status !== 'CANCELLED' &&
          appointment.status !== 'NO_SHOW'
            ? [
                {
                  label: 'Editar',
                  onClick: () => onEdit(appointment),
                },
              ]
            : []),
          ...statusActions.map(sa => ({
            label: sa.label,
            onClick: () => handleStatusChange(appointment.id, sa.status),
          })),
          ...(appointment.status === 'SCHEDULED' ||
          appointment.status === 'PENDING_APPROVAL'
            ? [
                {
                  label: 'Cancelar',
                  onClick: () => handleCancel(appointment.id),
                  variant: 'danger' as const,
                },
              ]
            : []),
          ...(appointment.status !== 'COMPLETED'
            ? [
                {
                  label: 'Eliminar',
                  onClick: () => handleDelete(appointment.id),
                  variant: 'danger' as const,
                },
              ]
            : []),
        ];

        return <ItemActions actions={actions} disabled={isLoading} />;
      },
    },
  ];

  return (
    <>
      <Table
        data={appointments}
        columns={columns}
        emptyMessage="No se encontraron citas"
        emptyDescription="Crea tu primera cita para empezar"
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirmar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}
