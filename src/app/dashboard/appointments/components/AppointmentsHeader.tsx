'use client';

import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';
import { useAppointments } from './AppointmentsClient';

export function AppointmentsHeader() {
  const { handleCreate } = useAppointments();

  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
          Gestión de Citas
        </h1>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Organiza, programa y visualiza todas las citas de tu spa.
        </p>
      </div>
      <Button onClick={handleCreate} className='hidden lg:flex'>
        <Plus className='w-4 h-4 mr-2' />
        Nueva Cita
      </Button>
    </div>
  );
}
