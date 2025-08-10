import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className='w-16 h-16 mb-4 text-gray-400 dark:text-gray-500'>
          {icon}
        </div>
      )}

      <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
        {title}
      </h3>

      {description && (
        <p className='text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm'>
          {description}
        </p>
      )}

      {action && <div className='flex justify-center'>{action}</div>}
    </div>
  );
}

// Predefined empty states for common use cases
export function EmptyClients() {
  return (
    <EmptyState
      title='No hay clientes registrados'
      description='Comienza agregando tu primer cliente para poder programar citas y hacer seguimiento de sus servicios.'
      icon={
        <svg
          className='w-full h-full'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
          />
        </svg>
      }
    />
  );
}

export function EmptyAppointments() {
  return (
    <EmptyState
      title='No hay citas programadas'
      description='No tienes citas programadas para este período. Crea una nueva cita para comenzar.'
      icon={
        <svg
          className='w-full h-full'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      }
    />
  );
}

export function EmptyServices() {
  return (
    <EmptyState
      title='No hay servicios configurados'
      description='Agrega los servicios que ofreces en tu spa para poder crear citas y calcular precios.'
      icon={
        <svg
          className='w-full h-full'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
          />
        </svg>
      }
    />
  );
}

export function EmptyManicurists() {
  return (
    <EmptyState
      title='No hay manicuristas registrados'
      description='Agrega manicuristas a tu equipo para poder asignarles citas y hacer seguimiento de su rendimiento.'
      icon={
        <svg
          className='w-full h-full'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
          />
        </svg>
      }
    />
  );
}
