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
  isWithinInterval,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui';
import type { AppointmentWithDetails } from '@/types';

interface AppointmentCalendarProps {
  appointments: AppointmentWithDetails[];
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  dateFrom?: Date;
  dateTo?: Date;
}

export function AppointmentCalendar({
  appointments,
  selectedDate,
  onDateSelect,
  dateFrom,
  dateTo,
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

  // Get indicator border color based on appointment count
  const getIndicatorBorderColor = (count: number) => {
    if (count === 0) return null;
    // Use pseudo-element to create a perfectly straight line that ignores border-radius
    if (count <= 2)
      return 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-400';
    if (count <= 4)
      return 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-400';
    if (count <= 6)
      return 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400';
    return 'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-400';
  };

  // Navigate months
  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="bg-gray-800 dark:bg-gray-800 rounded-lg border border-gray-700 dark:border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white dark:text-white capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="flex items-center gap-2">
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
          const indicatorBorderColor =
            getIndicatorBorderColor(appointmentCount);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          // Check if day is in filter range and determine position
          const isInFilterRange =
            dateFrom &&
            dateTo &&
            isWithinInterval(day, {
              start: startOfDay(dateFrom),
              end: endOfDay(dateTo),
            });

          // Determine if it's the start or end of a consecutive range
          const prevDay = addDays(day, -1);
          const nextDay = addDays(day, 1);

          const _isFilterRangeStart =
            isInFilterRange &&
            (!dateFrom ||
              isSameDay(day, dateFrom) ||
              !isWithinInterval(prevDay, {
                start: startOfDay(dateFrom),
                end: endOfDay(dateTo),
              }));

          const _isFilterRangeEnd =
            isInFilterRange &&
            (!dateTo ||
              isSameDay(day, dateTo) ||
              !isWithinInterval(nextDay, {
                start: startOfDay(dateFrom),
                end: endOfDay(dateTo),
              }));

          // Determine classes based on state
          // Use fixed size with box-border to ensure uniform sizing
          const baseClasses = `
            relative aspect-square w-full h-full min-h-0 p-2 text-sm transition-colors box-border
            ${!isCurrentMonth ? 'text-gray-600 dark:text-gray-600' : 'text-gray-100 dark:text-gray-100'}
          `;

          let dayClasses = baseClasses;

          // Apply borders conditionally based on state
          // Use box-border to ensure borders are included in the size calculation
          if (isSelected) {
            // Selected day: blue background with full border
            dayClasses +=
              ' rounded-lg bg-blue-600/30 dark:bg-blue-600/30 border-2 border-blue-400 dark:border-blue-400';
          } else if (isTodayDate) {
            // Today (not selected): subtle background with green/emerald full border
            dayClasses +=
              ' rounded-lg font-bold bg-emerald-500/20 dark:bg-emerald-500/20 border-2 border-emerald-400 dark:border-emerald-400';
          } else if (isInFilterRange) {
            // In filter range: light gray background, no border (border only on bottom if has appointments)
            // Keep consistent border-radius for all days, even in filter range
            dayClasses += ' bg-gray-500/20 dark:bg-gray-500/20 rounded-lg';
          } else {
            // Regular day: hover effect with rounded corners, no border (only bottom border for appointments)
            dayClasses += ' rounded-lg';
            dayClasses += isCurrentMonth
              ? ' hover:bg-gray-700 dark:hover:bg-gray-700'
              : ' hover:bg-gray-700/50 dark:hover:bg-gray-700/50';
          }

          // Add ONLY bottom border indicator for appointments using pseudo-element
          // This creates a perfectly straight colored line at the bottom (ignores border-radius)
          if (
            indicatorBorderColor &&
            appointmentCount > 0 &&
            !isSelected &&
            !isTodayDate
          ) {
            dayClasses += ` relative ${indicatorBorderColor}`;
          } else if (!isSelected && !isTodayDate) {
            // Add transparent bottom border to maintain consistent height for all regular days
            dayClasses += ' border-b-2 border-transparent';
          }

          // Tooltip text for days with appointments
          const tooltipText =
            appointmentCount > 0
              ? `${appointmentCount} ${appointmentCount === 1 ? 'cita' : 'citas'}`
              : undefined;

          return (
            <div
              key={index}
              className="relative group w-full aspect-square min-h-0"
            >
              <button
                type="button"
                onClick={() => onDateSelect(day)}
                className={dayClasses}
              >
                {/* Day number */}
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <span className="leading-none">{format(day, 'd')}</span>
                </div>
              </button>
              {/* Custom tooltip */}
              {tooltipText && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 shadow-lg">
                  {tooltipText}
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                </div>
              )}
            </div>
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
            <div className="w-8 h-0.5 bg-green-400 border-b-2 border-green-400" />
            <span>1-2 citas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-blue-400 border-b-2 border-blue-400" />
            <span>3-4 citas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-amber-400 border-b-2 border-amber-400" />
            <span>5-6 citas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-red-400 border-b-2 border-red-400" />
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
