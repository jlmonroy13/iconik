'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Card, CardContent } from '@/components/ui';
import { Select } from '@/components/ui/Select';
import type { AppointmentWithDetails } from '@/types/clients';

interface ClientAppointmentHistoryProps {
  appointments: AppointmentWithDetails[];
}

export function ClientAppointmentHistory({
  appointments,
}: ClientAppointmentHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        label: string;
        variant:
          | 'default'
          | 'success'
          | 'warning'
          | 'destructive'
          | 'secondary';
      }
    > = {
      PENDING_APPROVAL: { label: 'Pendiente', variant: 'warning' },
      SCHEDULED: { label: 'Programada', variant: 'default' },
      IN_PROGRESS: { label: 'En Progreso', variant: 'default' },
      COMPLETED: { label: 'Completada', variant: 'success' },
      CANCELLED: { label: 'Cancelada', variant: 'destructive' },
      NO_SHOW: { label: 'No Asistió', variant: 'secondary' },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      variant: 'secondary' as const,
    };

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  // Filter appointments by status
  const filteredAppointments =
    statusFilter === 'all'
      ? appointments
      : appointments.filter(apt => apt.status === statusFilter);

  // Calculate summary statistics
  const completedAppointments = appointments.filter(
    apt => apt.status === 'COMPLETED'
  );
  const totalCompleted = completedAppointments.length;
  const totalSpent = completedAppointments.reduce(
    (sum, apt) => sum + apt.totalAmount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total de Citas
              </p>
              <p className="text-2xl font-bold mt-1">{appointments.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completadas
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {totalCompleted}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Gastado
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filtrar por estado:
        </label>
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-48"
        >
          <option value="all">Todos</option>
          <option value="COMPLETED">Completadas</option>
          <option value="SCHEDULED">Programadas</option>
          <option value="CANCELLED">Canceladas</option>
          <option value="NO_SHOW">No Asistió</option>
        </Select>
      </div>

      {/* Appointments Table */}
      {filteredAppointments.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Servicios</TableHead>
                <TableHead>Manicurista</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map(appointment => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {formatDate(appointment.scheduledAt)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(appointment.scheduledAt)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {appointment.appointmentServices.map(service => (
                        <div
                          key={service.id}
                          className="text-sm flex items-center gap-2"
                        >
                          <span className="font-medium">
                            {service.service.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {appointment.appointmentServices.map(service => (
                        <div key={service.id} className="text-sm">
                          {service.manicurist.name}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold">
                      {formatCurrency(appointment.totalAmount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay citas
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {statusFilter === 'all'
              ? 'Este cliente aún no tiene citas registradas'
              : 'No hay citas con el estado seleccionado'}
          </p>
        </div>
      )}

      {/* Notes if any */}
      {filteredAppointments.some(apt => apt.notes) && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notas de Citas</h3>
            <div className="space-y-3">
              {filteredAppointments
                .filter(apt => apt.notes)
                .map(appointment => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {formatDate(appointment.scheduledAt)}
                      </span>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {appointment.notes}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
