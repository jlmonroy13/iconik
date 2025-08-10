'use client';

import { DashboardSectionLayout } from '../../components/DashboardSectionLayout';
import { AppointmentStats } from './AppointmentStats';
import { AppointmentFilters } from './AppointmentFilters';
import { AppointmentCalendar } from './AppointmentCalendar';
import { AppointmentList } from './AppointmentList';
import { FloatingActionButton } from './FloatingActionButton';
import { useAppointments } from './AppointmentsClient';
import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui';
import type { AppointmentWithDetails } from '@/types';
import type { AppointmentStats as AppointmentStatsType } from '../types';

interface AppointmentsSectionProps {
  appointments: AppointmentWithDetails[];
  stats: AppointmentStatsType;
}

export function AppointmentsSection({
  appointments,
  stats,
}: AppointmentsSectionProps) {
  const { handleEdit, handleDelete, handleCreate } = useAppointments();

  return (
    <DashboardSectionLayout
      icon={<CalendarPlus className='w-8 h-8 text-blue-600' />}
      title='Gestión de Citas'
      description='Organiza, programa y visualiza todas las citas de tu spa.'
      stats={<AppointmentStats stats={stats} />}
      actionButton={
        <Button
          onClick={handleCreate}
          variant='primary'
          className='w-full sm:w-auto flex items-center gap-2'
        >
          <CalendarPlus className='h-4 w-4' /> Nueva Cita
        </Button>
      }
    >
      <AppointmentFilters />
      <AppointmentCalendar appointments={appointments} />
      <AppointmentList
        appointments={appointments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <FloatingActionButton />
    </DashboardSectionLayout>
  );
}
