'use client';

import { useState } from 'react';
import {
  Eye,
  Pencil,
  X,
  Trash2,
  CheckCircle,
  UserX,
  Play,
  CheckCheck,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
  Badge,
  ItemActions,
  ConfirmDialog,
} from '@/components/ui';
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
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Status badge colors
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
      PENDING_APPROVAL: { variant: 'warning', label: 'Pendiente' },
      SCHEDULED: { variant: 'primary', label: 'Agendada' },
      IN_PROGRESS: { variant: 'success', label: 'En Progreso' },
      COMPLETED: { variant: 'default', label: 'Completada' },
      CANCELLED: { variant: 'destructive', label: 'Cancelada' },
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
    // Show confirmation dialog for NO_SHOW status
    if (newStatus === 'NO_SHOW') {
      handleNoShow(appointmentId);
      return;
    }

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
    } catch (_error) {
      alert('Error inesperado al cambiar el estado');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle no show appointment
  const handleNoShow = (appointmentId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Marcar como No Asistió',
      description:
        '¿Estás seguro de que deseas marcar esta cita como "No Asistió"? Esta acción cambiará el estado de la cita.',
      onConfirm: async () => {
        setActionLoading(appointmentId);
        setConfirmDialog({ ...confirmDialog, open: false });

        try {
          const result = await updateAppointmentStatus(
            appointmentId,
            spaId,
            branchId,
            { status: 'NO_SHOW' }
          );

          if (!result.success) {
            alert(result.error || 'Error al marcar como no asistió');
          }
        } catch (_error) {
          alert('Error inesperado al marcar como no asistió');
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  // Handle cancel appointment
  const handleCancel = (appointmentId: string) => {
    setConfirmDialog({
      open: true,
      title: 'Cancelar Cita',
      description: '¿Estás seguro de que deseas cancelar esta cita?',
      onConfirm: async () => {
        setActionLoading(appointmentId);
        setConfirmDialog({ ...confirmDialog, open: false });

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
        } catch (_error) {
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
      open: true,
      title: 'Eliminar Cita',
      description:
        '¿Estás seguro de que deseas eliminar esta cita permanentemente? Esta acción no se puede deshacer.',
      onConfirm: async () => {
        setActionLoading(appointmentId);
        setConfirmDialog({ ...confirmDialog, open: false });

        try {
          const result = await deleteAppointment(
            appointmentId,
            spaId,
            branchId
          );

          if (!result.success) {
            alert(result.error || 'Error al eliminar la cita');
          }
        } catch (_error) {
          alert('Error inesperado al eliminar la cita');
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  /**
   * Get available status transitions for current status
   *
   * ESTADOS DE CITAS Y SU PROPÓSITO:
   *
   * 1. PENDING_APPROVAL (Pendiente de Aprobación)
   *    - Citas creadas desde booking links que requieren aprobación del administrador
   *    - Puede cambiar a: SCHEDULED (Aprobar y Agendar)
   *
   * 2. SCHEDULED (Agendada)
   *    - Cita confirmada y programada para una fecha/hora específica
   *    - Puede cambiar a: IN_PROGRESS (Iniciar) o NO_SHOW (No Asistió)
   *
   * 3. IN_PROGRESS (En Progreso)
   *    - Cita que está actualmente en curso (la manicurista está trabajando)
   *    - Puede cambiar a: COMPLETED (Completar) o CANCELLED (Cancelar)
   *
   * 4. COMPLETED (Completada)
   *    - Cita finalizada exitosamente
   *    - Estado final: no puede cambiar a ningún otro estado
   *
   * 5. CANCELLED (Cancelada)
   *    - Cita cancelada antes de ser completada
   *    - Estado final: no puede cambiar a ningún otro estado
   *
   * 6. NO_SHOW (No Asistió)
   *    - Cliente no se presentó a la cita programada
   *    - Estado final: no puede cambiar a ningún otro estado
   */
  const getStatusActions = (currentStatus: AppointmentStatus) => {
    const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      // Removed 'CANCELLED' from transitions - handled separately via handleCancel
      PENDING_APPROVAL: ['SCHEDULED'],
      SCHEDULED: ['IN_PROGRESS', 'NO_SHOW'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
      NO_SHOW: [],
    };

    // Map transitions to their action labels
    // Format: [fromStatus, toStatus] => label
    const transitionLabels: Record<string, string> = {
      'PENDING_APPROVAL->SCHEDULED': 'Aprobar y Agendar',
      'SCHEDULED->IN_PROGRESS': 'Iniciar',
      'SCHEDULED->NO_SHOW': 'No Asistió',
      'IN_PROGRESS->COMPLETED': 'Completar',
      'IN_PROGRESS->CANCELLED': 'Cancelar',
    };

    const statusIcons: Record<AppointmentStatus, React.ReactNode> = {
      PENDING_APPROVAL: <CheckCheck className="w-4 h-4" />,
      SCHEDULED: <Play className="w-4 h-4" />,
      IN_PROGRESS: <CheckCircle className="w-4 h-4" />,
      COMPLETED: <CheckCircle className="w-4 h-4" />,
      CANCELLED: <X className="w-4 h-4" />,
      NO_SHOW: <UserX className="w-4 h-4" />,
    };

    return transitions[currentStatus].map(status => {
      const transitionKey = `${currentStatus}->${status}`;
      const label = transitionLabels[transitionKey] || status;

      return {
        status,
        label,
        icon: statusIcons[status],
      };
    });
  };

  // Get confirm button text based on dialog title
  const getConfirmText = (title: string) => {
    if (title.includes('Cancelar')) return 'Confirmar';
    if (title.includes('No Asistió')) return 'Confirmar';
    return 'Eliminar';
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
          <div className="font-medium text-gray-900 dark:text-white">
            {new Intl.DateTimeFormat('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).format(new Date(appointment.scheduledAt))}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Intl.DateTimeFormat('es-ES', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }).format(new Date(appointment.scheduledAt))}
          </div>
          {!appointment.isScheduled && (
            <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Walk-in
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Cliente',
      accessor: 'client' as const,
      cell: (appointment: AppointmentWithDetails) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {appointment.client.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {appointment.client.phone}
          </div>
        </div>
      ),
    },
    {
      header: 'Servicios',
      accessor: 'services' as const,
      cell: (appointment: AppointmentWithDetails) => (
        <div className="space-y-2">
          {appointment.services.map((service, index) => (
            <div key={index} className="text-sm">
              <div className="text-gray-900 dark:text-white font-medium">
                {service.service.name}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                {service.manicurist.name}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      header: 'Estado',
      accessor: 'status' as const,
      cell: (appointment: AppointmentWithDetails) => {
        // Check if appointment is in the past and still scheduled
        const scheduledTime = new Date(appointment.scheduledAt);
        const now = new Date();
        const isPastAppointment =
          appointment.status === 'SCHEDULED' && scheduledTime < now;

        const isPendingPreConfirmation =
          appointment.status === 'SCHEDULED' && !appointment.preConfirmedAt;
        const isPreConfirmed =
          appointment.status === 'SCHEDULED' && appointment.preConfirmedAt;

        return (
          <div className="flex flex-col gap-1 items-start">
            {!isPastAppointment && getStatusBadge(appointment.status)}
            {isPastAppointment && (
              <Badge variant="destructive" className="text-xs">
                Cita Vencida
              </Badge>
            )}
            {!isPastAppointment && isPendingPreConfirmation && (
              <Badge variant="warning" className="text-xs">
                Pendiente de Pre-Confirmación
              </Badge>
            )}
            {!isPastAppointment && isPreConfirmed && (
              <Badge variant="success" className="text-xs">
                Pre-Confirmada
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: 'Total',
      accessor: 'id' as const,
      cell: (appointment: AppointmentWithDetails) => {
        const { totalPrice, totalDuration } = getAppointmentTotals(appointment);
        return (
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              ${totalPrice.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {totalDuration} min
            </div>
          </div>
        );
      },
    },
    {
      header: 'Acciones',
      accessor: 'id' as const,
      cell: (appointment: AppointmentWithDetails) => {
        // Check if appointment is in the past and still scheduled
        const scheduledTime = new Date(appointment.scheduledAt);
        const now = new Date();
        const isPastAppointment =
          appointment.status === 'SCHEDULED' && scheduledTime < now;

        // For past appointments, filter status actions to only show valid ones
        let statusActions = getStatusActions(appointment.status);
        if (isPastAppointment) {
          // For past scheduled appointments, only allow NO_SHOW, not IN_PROGRESS
          statusActions = statusActions.filter(sa => sa.status === 'NO_SHOW');
        }

        const isLoading = actionLoading === appointment.id;

        const actions = [
          {
            label: 'Ver Detalles',
            icon: <Eye className="w-4 h-4" />,
            onClick: () => onView(appointment),
          },
          ...(appointment.status !== 'COMPLETED' &&
          appointment.status !== 'CANCELLED' &&
          appointment.status !== 'NO_SHOW' &&
          !isPastAppointment
            ? [
                {
                  label: 'Editar',
                  icon: <Pencil className="w-4 h-4" />,
                  onClick: () => onEdit(appointment),
                },
              ]
            : []),
          ...statusActions.map(sa => ({
            label: sa.label,
            icon: sa.icon,
            onClick: () => handleStatusChange(appointment.id, sa.status),
          })),
          ...(appointment.status === 'SCHEDULED' ||
          appointment.status === 'PENDING_APPROVAL'
            ? [
                {
                  label: 'Cancelar',
                  icon: <X className="w-4 h-4" />,
                  onClick: () => handleCancel(appointment.id),
                  variant: 'danger' as const,
                },
              ]
            : []),
          ...(appointment.status !== 'COMPLETED'
            ? [
                {
                  label: 'Eliminar',
                  icon: <Trash2 className="w-4 h-4" />,
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

  if (appointments.length === 0) {
    return (
      <>
        <TableEmptyState
          title="No se encontraron citas"
          description="Crea tu primera cita para empezar"
        />

        <ConfirmDialog
          open={confirmDialog.open}
          onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          description={confirmDialog.description}
          confirmText={getConfirmText(confirmDialog.title)}
          cancelText="Cancelar"
          isLoading={actionLoading !== null}
        />
      </>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, colIndex) => (
              <TableHead key={`header-${colIndex}-${column.header}`}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment, index) => {
            // Check if appointment is in the past and still scheduled
            const scheduledTime = new Date(appointment.scheduledAt);
            const now = new Date();
            const isPastAppointment =
              appointment.status === 'SCHEDULED' && scheduledTime < now;

            return (
              <TableRow
                key={appointment.id}
                isAlternate={index % 2 !== 0}
                className={
                  isPastAppointment
                    ? 'border-l-4 border-l-red-500 dark:border-l-red-600 bg-red-50/30 dark:bg-red-900/10'
                    : undefined
                }
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={`${appointment.id}-${colIndex}-${column.header}`}
                  >
                    {column.cell(appointment)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={confirmDialog.open}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={getConfirmText(confirmDialog.title)}
        cancelText="Cancelar"
        isLoading={actionLoading !== null}
      />
    </>
  );
}
