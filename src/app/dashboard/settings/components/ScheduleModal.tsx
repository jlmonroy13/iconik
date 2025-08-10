import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button, Input } from '@/components/ui';
import { ScheduleEntrySchema, type ScheduleEntryFormValues } from '../schemas';

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleEntryFormValues) => Promise<void>;
  initialData?: ScheduleEntryFormValues & { id?: string };
  mode: 'create' | 'edit';
  existingSchedules: Array<{
    dayOfWeek?: number | null;
    isHoliday: boolean;
    id?: string;
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

const defaultValues: ScheduleEntryFormValues = {
  isHoliday: false,
  isOpen: true,
  startTime: '08:30',
  endTime: '19:00',
  dayOfWeek: 1,
  // description es opcional
};

export function ScheduleModal({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
  existingSchedules,
}: ScheduleModalProps) {
  const form = useForm<ScheduleEntryFormValues>({
    resolver: zodResolver(ScheduleEntrySchema),
    defaultValues: initialData || defaultValues,
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    form.reset(initialData || defaultValues);
  }, [open, initialData]);

  // Custom validation for duplicate day/festivo
  const validateDuplicate = (values: ScheduleEntryFormValues) => {
    const isDuplicate = existingSchedules.some(sch => {
      if (mode === 'edit' && initialData?.id && sch.id === initialData.id)
        return false;
      if (values.isHoliday && sch.isHoliday) return true;
      if (
        !values.isHoliday &&
        !sch.isHoliday &&
        sch.dayOfWeek === values.dayOfWeek
      )
        return true;
      return false;
    });
    if (isDuplicate) {
      return {
        dayOfWeek: { message: 'Ya existe un horario para este día o festivo.' },
      };
    }
    return {};
  };

  const handleSubmit = form.handleSubmit(async values => {
    const errors = validateDuplicate(values);
    if (Object.keys(errors).length > 0) {
      form.setError('dayOfWeek', { message: errors.dayOfWeek?.message });
      form.setError('isHoliday', { message: errors.dayOfWeek?.message });
      return;
    }
    await onSubmit(values);
    onClose();
  });

  // Helper to get error as string
  const getError = (err: string | undefined) => {
    if (!err) return undefined;
    return err;
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={mode === 'create' ? 'Agregar Horario' : 'Editar Horario'}
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Tipo de día */}
        <div className='flex gap-2 mb-2'>
          <Button
            type='button'
            variant={form.watch('isHoliday') ? 'outline' : 'primary'}
            size='sm'
            onClick={() => {
              form.setValue('isHoliday', false);
              form.setValue('dayOfWeek', 1);
            }}
          >
            Día de la semana
          </Button>
          <Button
            type='button'
            variant={form.watch('isHoliday') ? 'primary' : 'outline'}
            size='sm'
            onClick={() => {
              form.setValue('isHoliday', true);
              form.setValue('dayOfWeek', undefined);
            }}
          >
            Festivo
          </Button>
        </div>
        {/* Día de la semana */}
        {!form.watch('isHoliday') && (
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Día de la semana
            </label>
            <select
              {...form.register('dayOfWeek', { valueAsNumber: true })}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              {DAYS_OF_WEEK.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
            {form.formState.errors.dayOfWeek && (
              <p className='text-xs text-red-600 mt-1'>
                {getError(
                  form.formState.errors.dayOfWeek.message as string | undefined
                )}
              </p>
            )}
          </div>
        )}
        {/* Abierto/Cerrado */}
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={form.watch('isOpen')}
            onChange={e => form.setValue('isOpen', e.target.checked)}
            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
            id='isOpen'
          />
          <label
            htmlFor='isOpen'
            className='text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            {form.watch('isOpen') ? 'Abierto' : 'Cerrado'}
          </label>
        </div>
        {/* Horas */}
        {form.watch('isOpen') && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='Hora de Apertura'
              type='time'
              {...form.register('startTime')}
              error={getError(
                form.formState.errors.startTime?.message as string | undefined
              )}
              disabled={form.formState.isSubmitting}
            />
            <Input
              label='Hora de Cierre'
              type='time'
              {...form.register('endTime')}
              error={getError(
                form.formState.errors.endTime?.message as string | undefined
              )}
              disabled={form.formState.isSubmitting}
            />
          </div>
        )}
        {/* Descripción */}
        <Input
          label='Descripción (opcional)'
          {...form.register('description')}
          error={getError(
            form.formState.errors.description?.message as string | undefined
          )}
          disabled={form.formState.isSubmitting}
        />
        <div className='flex justify-end gap-2 mt-4'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Cancelar
          </Button>
          <Button type='submit' disabled={form.formState.isSubmitting}>
            {mode === 'create' ? 'Agregar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
