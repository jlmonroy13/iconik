'use client';

import { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import type { AppointmentWithDetails } from '@/types';

interface AppointmentCalendarProps {
  appointments: AppointmentWithDetails[];
}

export function AppointmentCalendar({
  appointments,
}: AppointmentCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Generate week days
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Business hours (9 AM to 7 PM)
  const businessHours = Array.from({ length: 10 }, (_, i) => i + 9); // 9, 10, 11, 12, 13, 14, 15, 16, 17, 18

  const getAppointmentsForDayAndHour = (date: Date, hour: number) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.scheduledAt);
      return (
        isSameDay(appointmentDate, date) && appointmentDate.getHours() === hour
      );
    });
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.scheduledAt);
      return isSameDay(appointmentDate, date);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to get primary service info
  const getPrimaryServiceInfo = (appointment: AppointmentWithDetails) => {
    if (appointment.services.length === 0) {
      return { name: 'Sin servicios', duration: 0, price: 0 };
    }
    const primaryService = appointment.services[0];
    return {
      name: primaryService.service.name,
      duration: primaryService.service.duration,
      price: appointment.services.reduce((sum, s) => sum + s.price, 0),
    };
  };

  return (
    <div className='space-y-4'>
      {/* Calendar Header */}
      <div className='flex items-center justify-between'>
        <button
          onClick={() => navigateWeek('prev')}
          className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base'
        >
          <span className='hidden sm:inline'>← Semana anterior</span>
          <span className='sm:hidden'>←</span>
        </button>
        <h3 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white text-center'>
          {format(weekStart, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => navigateWeek('next')}
          className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base'
        >
          <span className='hidden sm:inline'>Siguiente semana →</span>
          <span className='sm:hidden'>→</span>
        </button>
      </div>

      {/* Mobile Week View */}
      <div className='block lg:hidden'>
        <div className='grid grid-cols-7 gap-1 mb-4'>
          {weekDays.map(day => {
            const dayAppointments = getAppointmentsForDay(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                className={`p-2 rounded-lg text-center transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : isToday(day)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className='text-xs font-medium'>{format(day, 'EEE')}</div>
                <div className='text-lg font-bold'>{format(day, 'd')}</div>
                {dayAppointments.length > 0 && (
                  <div className='text-xs mt-1'>
                    {dayAppointments.length} cita
                    {dayAppointments.length !== 1 ? 's' : ''}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Details */}
        {selectedDate && (
          <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4'>
            <h4 className='font-semibold text-gray-900 dark:text-white mb-3'>
              {format(selectedDate, "EEEE, d 'de' MMMM")}
            </h4>
            <div className='space-y-3'>
              {getAppointmentsForDay(selectedDate).length > 0 ? (
                getAppointmentsForDay(selectedDate).map(appointment => {
                  const serviceInfo = getPrimaryServiceInfo(appointment);
                  return (
                    <div
                      key={appointment.id}
                      className={`p-3 rounded-lg ${getStatusColor(appointment.status)}`}
                    >
                      <div className='flex items-center justify-between mb-1'>
                        <span className='font-medium text-sm'>
                          {appointment.client.name}
                        </span>
                        <span className='text-xs'>
                          {format(new Date(appointment.scheduledAt), 'HH:mm')}
                        </span>
                      </div>
                      <div className='text-xs opacity-75'>
                        {serviceInfo.name} • {serviceInfo.duration} min
                      </div>
                      <div className='text-xs font-medium mt-1'>
                        {formatCurrency(serviceInfo.price)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className='text-gray-500 dark:text-gray-400 text-center py-4'>
                  No hay citas programadas para este día
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Calendar Grid */}
      <div className='hidden lg:block overflow-x-auto'>
        <div className='min-w-[800px]'>
          {/* Header Row */}
          <div className='grid grid-cols-8 gap-1'>
            <div className='p-2 text-sm font-medium text-gray-500 dark:text-gray-400'>
              Hora
            </div>
            {weekDays.map(day => (
              <div
                key={day.toISOString()}
                className={`p-2 text-sm font-medium text-center ${
                  isToday(day)
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                <div>{format(day, 'EEE')}</div>
                <div className='text-xs'>{format(day, 'd')}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {businessHours.map(hour => (
            <div
              key={hour}
              className='grid grid-cols-8 gap-1 border-t border-gray-200 dark:border-gray-700'
            >
              <div className='p-2 text-sm text-gray-500 dark:text-gray-400 flex items-center'>
                {format(new Date().setHours(hour), 'HH:mm')}
              </div>
              {weekDays.map(day => {
                const dayAppointments = getAppointmentsForDayAndHour(day, hour);
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className='p-1 min-h-[60px] border-r border-gray-200 dark:border-gray-700 last:border-r-0'
                  >
                    {dayAppointments.map(appointment => {
                      const serviceInfo = getPrimaryServiceInfo(appointment);
                      return (
                        <div
                          key={appointment.id}
                          className={`p-2 rounded text-xs ${getStatusColor(appointment.status)} mb-1`}
                        >
                          <div className='font-medium truncate'>
                            {appointment.client.name}
                          </div>
                          <div className='opacity-75 truncate'>
                            {serviceInfo.name}
                          </div>
                          <div className='font-medium'>
                            {formatCurrency(serviceInfo.price)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className='flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm'>
        <div className='flex items-center gap-1 sm:gap-2'>
          <div className='w-2 h-2 sm:w-3 sm:h-3 bg-blue-100 dark:bg-blue-900/20 rounded'></div>
          <span>Programada</span>
        </div>
        <div className='flex items-center gap-1 sm:gap-2'>
          <div className='w-2 h-2 sm:w-3 sm:h-3 bg-green-100 dark:bg-green-900/20 rounded'></div>
          <span>Confirmada</span>
        </div>
        <div className='flex items-center gap-1 sm:gap-2'>
          <div className='w-2 h-2 sm:w-3 sm:h-3 bg-yellow-100 dark:bg-yellow-900/20 rounded'></div>
          <span>En Progreso</span>
        </div>
        <div className='flex items-center gap-1 sm:gap-2'>
          <div className='w-2 h-2 sm:w-3 sm:h-3 bg-purple-100 dark:bg-purple-900/20 rounded'></div>
          <span>Completada</span>
        </div>
        <div className='flex items-center gap-1 sm:gap-2'>
          <div className='w-2 h-2 sm:w-3 sm:h-3 bg-red-100 dark:bg-red-900/20 rounded'></div>
          <span>Cancelada</span>
        </div>
      </div>
    </div>
  );
}
