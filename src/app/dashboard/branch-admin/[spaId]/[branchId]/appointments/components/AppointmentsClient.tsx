'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  Pagination,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingOverlay,
  Badge,
} from '@/components/ui';
import { SectionHeader } from '@/components/dashboard/SectionHeader';
import type {
  AppointmentWithDetails,
  AppointmentFilters,
  AppointmentFormDropdownData,
} from '@/types';
import { AppointmentModal } from './AppointmentModal';
import { AppointmentTable } from './AppointmentTable';
import { AppointmentDetailsModal } from './AppointmentDetailsModal';
import { AppointmentFilters as Filters } from './AppointmentFilters';
import { AppointmentCalendar } from './AppointmentCalendar';
import { startOfDay, endOfDay } from 'date-fns';

interface AppointmentsClientProps {
  appointments: AppointmentWithDetails[];
  formData: AppointmentFormDropdownData;
  spaId: string;
  branchId: string;
  branchName: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

export function AppointmentsClient({
  appointments,
  formData,
  spaId,
  branchId,
  branchName,
  pagination,
}: AppointmentsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithDetails | null>(null);

  // Calendar selected date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Current filters (from URL params)
  const currentFilters: AppointmentFilters = {
    status:
      (searchParams.get('status') as AppointmentFilters['status']) || 'ALL',
    manicuristId: searchParams.get('manicuristId') || undefined,
    clientId: searchParams.get('clientId') || undefined,
    search: searchParams.get('search') || undefined,
    dateFrom: searchParams.get('dateFrom')
      ? new Date(searchParams.get('dateFrom')!)
      : undefined,
    dateTo: searchParams.get('dateTo')
      ? new Date(searchParams.get('dateTo')!)
      : undefined,
  };

  // Handle filters change
  const handleFiltersChange = (filters: AppointmentFilters) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      // Update or remove filter params
      if (filters.status && filters.status !== 'ALL') {
        params.set('status', filters.status);
      } else {
        params.delete('status');
      }

      if (filters.manicuristId) {
        params.set('manicuristId', filters.manicuristId);
      } else {
        params.delete('manicuristId');
      }

      if (filters.clientId) {
        params.set('clientId', filters.clientId);
      } else {
        params.delete('clientId');
      }

      if (filters.search) {
        params.set('search', filters.search);
      } else {
        params.delete('search');
      }

      if (filters.dateFrom) {
        params.set('dateFrom', filters.dateFrom.toISOString());
      } else {
        params.delete('dateFrom');
      }

      if (filters.dateTo) {
        params.set('dateTo', filters.dateTo.toISOString());
      } else {
        params.delete('dateTo');
      }

      // Reset to page 1 when filters change
      params.set('page', '1');

      router.push(`?${params.toString()}`);
    });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`?${params.toString()}`);
    });
  };

  // Handle create appointment
  const handleCreate = () => {
    setSelectedAppointment(null);
    setIsCreateModalOpen(true);
  };

  // Handle edit appointment
  const handleEdit = (appointment: AppointmentWithDetails) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  // Handle view details
  const handleViewDetails = (appointment: AppointmentWithDetails) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  // Handle calendar date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);

    // Update filters to show appointments for selected date
    // This will automatically sync the quick filter button via useEffect in AppointmentFilters
    handleFiltersChange({
      ...currentFilters,
      dateFrom: startOfDay(date),
      dateTo: endOfDay(date),
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <SectionHeader
        title="Gestión de Citas"
        description={`Administra las citas de ${branchName}`}
        action={<Button onClick={handleCreate}>+ Nueva Cita</Button>}
      />

      {/* Filters - Full Width */}
      <Filters
        filters={currentFilters}
        onFiltersChange={handleFiltersChange}
        formData={formData}
        onClearCalendarSelection={() => setSelectedDate(undefined)}
      />

      {/* Content - Table and Calendar in same row */}
      <LoadingOverlay isLoading={isPending}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Table Column */}
          <div className="lg:col-span-4">
            {/* Table */}
            <Card className="shadow-sm">
              <CardHeader className="sm:py-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="text-xl m-0">Citas</CardTitle>
                  <div className="flex items-center gap-3 text-sm flex-shrink-0">
                    <Badge
                      variant="primary"
                      className="whitespace-nowrap text-[14px] px-4 py-1 font-bold"
                    >
                      {pagination.totalCount}{' '}
                      {pagination.totalCount === 1 ? 'cita' : 'citas'}
                    </Badge>
                    {pagination.totalCount > 0 &&
                      appointments.length !== pagination.totalCount && (
                        <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          ({appointments.length} en esta página)
                        </span>
                      )}
                    {pagination.totalPages > 1 && (
                      <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        | Página {pagination.currentPage} /{' '}
                        {pagination.totalPages}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="sm:p-2">
                {appointments.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No hay citas
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {currentFilters.status !== 'ALL' ||
                      currentFilters.dateFrom ||
                      currentFilters.search
                        ? 'No se encontraron citas con los filtros seleccionados.'
                        : 'Aún no hay citas registradas. Crea tu primera cita para empezar.'}
                    </p>
                    {(currentFilters.status !== 'ALL' ||
                      currentFilters.dateFrom ||
                      currentFilters.search) && (
                      <button
                        onClick={() => {
                          handleFiltersChange({
                            status: 'ALL',
                            manicuristId: undefined,
                            clientId: undefined,
                            dateFrom: undefined,
                            dateTo: undefined,
                            search: undefined,
                          });
                        }}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                ) : (
                  <AppointmentTable
                    appointments={appointments}
                    spaId={spaId}
                    branchId={branchId}
                    onEdit={handleEdit}
                    onView={handleViewDetails}
                  />
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  pagination={{
                    currentPage: pagination.currentPage,
                    totalPages: pagination.totalPages,
                    totalCount: pagination.totalCount,
                    hasNextPage: pagination.hasNextPage,
                    hasPrevPage: pagination.hasPrevPage,
                    limit: pagination.limit,
                  }}
                  onPageChange={handlePageChange}
                  itemName="citas"
                />
              </div>
            )}
          </div>

          {/* Calendar Column */}
          <div className="lg:col-span-1">
            <AppointmentCalendar
              appointments={appointments}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              dateFrom={currentFilters.dateFrom}
              dateTo={currentFilters.dateTo}
            />
          </div>
        </div>
      </LoadingOverlay>

      {/* Modals */}
      <AppointmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        formData={formData}
        spaId={spaId}
        branchId={branchId}
      />

      <AppointmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        appointment={selectedAppointment || undefined}
        formData={formData}
        spaId={spaId}
        branchId={branchId}
      />

      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        appointment={selectedAppointment}
        onEdit={handleEdit}
        spaId={spaId}
        branchId={branchId}
      />
    </div>
  );
}
