import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  EmptyState,
} from '@/components/ui';
import { Calendar } from 'lucide-react';
import { formatDate } from '../utils/formatters';
import type { Appointment } from '../types/dashboard';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

export function UpcomingAppointments({
  appointments,
}: UpcomingAppointmentsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge variant='secondary'>Programada</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant='default'>En Progreso</Badge>;
      case 'COMPLETED':
        return <Badge variant='success'>Completada</Badge>;
      case 'CANCELLED':
        return <Badge variant='destructive'>Cancelada</Badge>;
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Citas</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className='space-y-3'>
            {appointments.map(appointment => (
              <div
                key={appointment.id}
                className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
              >
                <div className='flex-1'>
                  <p className='font-medium text-gray-900 dark:text-white'>
                    {appointment.client.name}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {appointment.manicurist?.name} •{' '}
                    {formatDate(appointment.scheduledAt)}
                  </p>
                  <p className='text-xs text-gray-400'>
                    {appointment.services.map(s => s.service.name).join(', ')}
                  </p>
                </div>
                {getStatusBadge(appointment.status)}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title='No hay citas próximas'
            description='Las citas programadas aparecerán aquí.'
            icon={<Calendar className='w-8 h-8' />}
          />
        )}
      </CardContent>
    </Card>
  );
}
