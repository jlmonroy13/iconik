'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui';
import type { AppointmentWithDetails } from '@/types';

interface AppointmentCalendarProps {
  appointments: AppointmentWithDetails[];
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
}

export function AppointmentCalendar({
  appointments,
  selectedDate,
  onDateSelect,
}: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get calendar days for current month view
  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  // Count appointments for a specific day
  const getAppointmentCountForDay = (date: Date) => {
    return appointments.filter(apt =>
      isSameDay(new Date(apt.scheduledAt), date)
    ).length;
  };

  // Get indicator color based on appointment count
  const getIndicatorColor = (count: number) => {
    if (count === 0) return null;
    if (count <= 2) return 'bg-green-400';
    if (count <= 4) return 'bg-blue-400';
    if (count <= 6) return 'bg-amber-400';
    return 'bg-red-400';
  };

  // Navigate months
  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
    onDateSelect(new Date());
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="bg-gray-800 dark:bg-gray-800 rounded-lg border border-gray-700 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white dark:text-white capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleToday}>
            Hoy
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePreviousMonth}
          >
            ‹
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
          >
            ›
          </Button>
        </div>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-400 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const appointmentCount = getAppointmentCountForDay(day);
          const indicatorColor = getIndicatorColor(appointmentCount);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={index}
              type="button"
              onClick={() => onDateSelect(day)}
              className={`
                relative aspect-square p-2 rounded-lg text-sm transition-colors
                ${!isCurrentMonth ? 'text-gray-600 dark:text-gray-600' : 'text-gray-100 dark:text-gray-100'}
                ${isTodayDate ? 'font-bold border-2 border-blue-400 dark:border-blue-400' : ''}
                ${isSelected ? 'bg-blue-600/30 dark:bg-blue-600/30 border-2 border-blue-400 dark:border-blue-400' : 'hover:bg-gray-700 dark:hover:bg-gray-700'}
                ${!isCurrentMonth && !isSelected ? 'hover:bg-gray-700/50 dark:hover:bg-gray-700/50' : ''}
              `}
            >
              {/* Day number */}
              <div className="flex flex-col items-center justify-center h-full">
                <span>{format(day, 'd')}</span>

                {/* Appointment indicator */}
                {indicatorColor && appointmentCount > 0 && (
                  <div className="mt-1 flex items-center justify-center">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${indicatorColor}`}
                    />
                    {appointmentCount > 1 && (
                      <span className="ml-1 text-[10px] font-medium text-gray-300 dark:text-gray-300">
                        {appointmentCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-700 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-300 dark:text-gray-300 mb-2">
          Leyenda:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span>1-2 citas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span>3-4 citas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span>5-6 citas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span>7+ citas</span>
          </div>
        </div>
      </div>

      {/* Today indicator info */}
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-gray-700 dark:border-gray-700">
          <p className="text-sm font-medium text-white dark:text-white capitalize">
            {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
            {getAppointmentCountForDay(selectedDate) === 0
              ? 'No hay citas para este día'
              : `${getAppointmentCountForDay(selectedDate)} ${
                  getAppointmentCountForDay(selectedDate) === 1
                    ? 'cita'
                    : 'citas'
                }`}
          </p>
        </div>
      )}
    </div>
  );
}
