'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, X, Plus } from 'lucide-react';
import { updateOperatingHours } from '../actions';
import {
  OperatingHoursSchema,
  DefaultScheduleConfig,
  type OperatingHoursFormValues,
} from '../schemas';
import {
  Button,
  Input,
  useNotifications,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui';

interface ComplexOperatingHoursFormProps {
  schedules?: Array<{
    id?: string;
    dayOfWeek?: number | null;
    isHoliday: boolean;
    isOpen: boolean;
    startTime: string;
    endTime: string;
    description?: string | null;
  }>;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export function ComplexOperatingHoursForm({
  schedules = [],
}: ComplexOperatingHoursFormProps) {
  const [isPending, startTransition] = useTransition();
  const { showSuccess, showError } = useNotifications();

  // Initialize with default schedules if none provided
  const defaultSchedules =
    schedules.length > 0 ? schedules : DefaultScheduleConfig;

  const normalizedSchedules = defaultSchedules.map(sch => ({
    ...sch,
    dayOfWeek: sch.dayOfWeek ?? undefined,
    description: sch.description ?? undefined,
  }));

  const form = useForm({
    resolver: zodResolver(OperatingHoursSchema),
    defaultValues: {
      schedules: normalizedSchedules,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'schedules',
  });

  const onSubmit = (data: OperatingHoursFormValues) => {
    startTransition(async () => {
      const result = await updateOperatingHours(data);
      if (result.success) {
        showSuccess(
          'Horarios actualizados',
          'Los horarios de operación han sido actualizados.'
        );
        form.reset(data);
      } else {
        showError('Error al actualizar', result.message);
      }
    });
  };

  const addSchedule = () => {
    const isHoliday = false; // o true si quieres agregar un festivo por defecto
    const base = {
      isHoliday,
      isOpen: true,
      startTime: '09:00',
      endTime: '18:00',
      description: '',
    };
    if (!isHoliday) {
      append({ ...base, dayOfWeek: 1 });
    } else {
      append(base);
    }
  };

  const removeSchedule = (index: number) => {
    remove(index);
  };

  const getDayLabel = (dayOfWeek: number | undefined, isHoliday: boolean) => {
    if (isHoliday) return 'Festivos';
    if (dayOfWeek === undefined) return 'Día específico';
    return DAYS_OF_WEEK.find(day => day.value === dayOfWeek)?.label || 'Día';
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
      {/* Schedule List */}
      <div className='space-y-4'>
        {fields.map((field, index) => (
          <Card key={field.id} className='border-l-4 border-l-blue-500'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Calendar className='w-5 h-5' />
                  {getDayLabel(
                    form.watch(`schedules.${index}.dayOfWeek`),
                    form.watch(`schedules.${index}.isHoliday`)
                  )}
                </CardTitle>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => removeSchedule(index)}
                  className='text-red-600 hover:text-red-700'
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Day Type Selection */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Tipo de día
                  </label>
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      variant={
                        form.watch(`schedules.${index}.isHoliday`)
                          ? 'outline'
                          : 'primary'
                      }
                      size='sm'
                      onClick={() => {
                        form.setValue(`schedules.${index}.isHoliday`, false);
                        form.setValue(`schedules.${index}.dayOfWeek`, 1);
                      }}
                    >
                      Día de la semana
                    </Button>
                    <Button
                      type='button'
                      variant={
                        form.watch(`schedules.${index}.isHoliday`)
                          ? 'primary'
                          : 'outline'
                      }
                      size='sm'
                      onClick={() => {
                        form.setValue(`schedules.${index}.isHoliday`, true);
                        form.setValue(
                          `schedules.${index}.dayOfWeek`,
                          undefined
                        );
                      }}
                    >
                      Festivo
                    </Button>
                  </div>
                </div>

                {!form.watch(`schedules.${index}.isHoliday`) && (
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      Día de la semana
                    </label>
                    <select
                      {...form.register(`schedules.${index}.dayOfWeek`)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      {DAYS_OF_WEEK.map(day => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Open/Closed Toggle */}
              <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                <div>
                  <p className='font-medium text-gray-900 dark:text-white'>
                    {form.watch(`schedules.${index}.isOpen`)
                      ? 'Abierto'
                      : 'Cerrado'}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {form.watch(`schedules.${index}.isOpen`)
                      ? 'El spa estará abierto en este horario'
                      : 'El spa estará cerrado este día'}
                  </p>
                </div>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={form.watch(`schedules.${index}.isOpen`)}
                    onChange={e =>
                      form.setValue(
                        `schedules.${index}.isOpen`,
                        e.target.checked
                      )
                    }
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
                  />
                </div>
              </div>

              {/* Time Schedule */}
              {form.watch(`schedules.${index}.isOpen`) && (
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='space-y-2'>
                    <Input
                      label='Hora de Apertura'
                      type='time'
                      {...form.register(`schedules.${index}.startTime`)}
                      error={
                        form.formState.errors.schedules?.[index]?.startTime
                          ?.message
                      }
                      disabled={isPending}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Input
                      label='Hora de Cierre'
                      type='time'
                      {...form.register(`schedules.${index}.endTime`)}
                      error={
                        form.formState.errors.schedules?.[index]?.endTime
                          ?.message
                      }
                      disabled={isPending}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Input
                      label='Descripción (opcional)'
                      placeholder='Ej: Domingo no laboramos'
                      {...form.register(`schedules.${index}.description`)}
                      error={
                        form.formState.errors.schedules?.[index]?.description
                          ?.message
                      }
                      disabled={isPending}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Schedule Button */}
      <div className='flex justify-center'>
        <Button
          type='button'
          variant='outline'
          onClick={addSchedule}
          disabled={isPending}
          className='flex items-center gap-2'
        >
          <Plus className='w-4 h-4' />
          Agregar Horario
        </Button>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-3 pt-6 border-t'>
        <Button
          type='button'
          variant='secondary'
          onClick={() => form.reset(form.formState.defaultValues)}
          disabled={!form.formState.isDirty || isPending}
        >
          Cancelar
        </Button>
        <Button type='submit' disabled={!form.formState.isDirty || isPending}>
          {isPending ? 'Guardando...' : 'Guardar Horarios'}
        </Button>
      </div>
    </form>
  );
}
