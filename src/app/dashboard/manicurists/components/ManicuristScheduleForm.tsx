'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, Input, Select } from '@/components/ui';
import { Plus, Trash2, Clock } from 'lucide-react';
import type { ManicuristScheduleData } from '../schemas';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export function ManicuristScheduleForm() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules',
  });

  const schedules = watch('schedules') || [];
  const usedDays = schedules.map(
    (schedule: ManicuristScheduleData) => schedule.dayOfWeek
  );

  const availableDays = DAYS_OF_WEEK.filter(
    day => !usedDays.includes(day.value)
  );

  const addSchedule = () => {
    if (availableDays.length > 0) {
      append({
        dayOfWeek: availableDays[0].value,
        startTime: '09:00',
        endTime: '17:00',
        isActive: true,
      });
    }
  };

  const updateScheduleField = (
    index: number,
    field: keyof ManicuristScheduleData,
    value: string | number | boolean
  ) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = { ...updatedSchedules[index], [field]: value };
    setValue('schedules', updatedSchedules);
  };

  const getFieldError = (
    index: number,
    field: keyof ManicuristScheduleData
  ): string | undefined => {
    const fieldErrors = errors.schedules as
      | { [key: number]: { [key: string]: { message?: string } } }
      | undefined;
    return fieldErrors?.[index]?.[field]?.message;
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between border-b pb-2'>
        <div className='flex items-center gap-2'>
          <Clock className='h-5 w-5 text-gray-600' />
          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
            Horarios de trabajo
          </h3>
        </div>
        {availableDays.length > 0 && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addSchedule}
            className='flex items-center gap-2'
          >
            <Plus className='h-4 w-4' />
            Agregar día
          </Button>
        )}
      </div>

      {fields.length === 0 && (
        <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
          <Clock className='h-12 w-12 mx-auto mb-4 opacity-50' />
          <p>No hay horarios configurados</p>
          <p className='text-sm'>Agrega los días y horarios de trabajo</p>
        </div>
      )}

      <div className='space-y-3'>
        {fields.map((field, index) => {
          const currentDay = schedules[index]?.dayOfWeek;
          const currentDayLabel = DAYS_OF_WEEK.find(
            day => day.value === currentDay
          )?.label;

          return (
            <div
              key={field.id}
              className='border border-gray-200 dark:border-gray-700 rounded-lg p-4'
            >
              <div className='flex items-center justify-between mb-3'>
                <h4 className='font-medium text-gray-900 dark:text-white'>
                  {currentDayLabel}
                </h4>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => remove(index)}
                  className='text-red-600 hover:text-red-700'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Select
                  label='Día de la semana'
                  value={currentDay}
                  onChange={e => {
                    const newValue = parseInt(e.target.value);
                    updateScheduleField(index, 'dayOfWeek', newValue);
                  }}
                  error={getFieldError(index, 'dayOfWeek')}
                >
                  {DAYS_OF_WEEK.map(day => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </Select>

                <Input
                  label='Hora de inicio'
                  type='time'
                  value={schedules[index]?.startTime || ''}
                  onChange={e => {
                    updateScheduleField(index, 'startTime', e.target.value);
                  }}
                  error={getFieldError(index, 'startTime')}
                />

                <Input
                  label='Hora de fin'
                  type='time'
                  value={schedules[index]?.endTime || ''}
                  onChange={e => {
                    updateScheduleField(index, 'endTime', e.target.value);
                  }}
                  error={getFieldError(index, 'endTime')}
                />
              </div>

              <div className='mt-3'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={schedules[index]?.isActive ?? true}
                    onChange={e => {
                      updateScheduleField(index, 'isActive', e.target.checked);
                    }}
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    Día activo
                  </span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {errors.schedules && (
        <p className='text-sm text-red-600 dark:text-red-400'>
          {errors.schedules.message as string}
        </p>
      )}
    </div>
  );
}
