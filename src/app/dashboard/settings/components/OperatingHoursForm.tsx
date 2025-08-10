'use client';

import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateOperatingHours } from '../actions';
import {
  OperatingHoursSchema,
  type OperatingHoursFormValues,
} from '../schemas';
import { Button, Input, useNotifications } from '@/components/ui';

interface OperatingHoursFormProps {
  openingTime?: string | null;
  closingTime?: string | null;
}

export function OperatingHoursForm({
  openingTime,
  closingTime,
}: OperatingHoursFormProps) {
  const [isPending, startTransition] = useTransition();
  const { showSuccess, showError } = useNotifications();

  const form = useForm<OperatingHoursFormValues>({
    resolver: zodResolver(OperatingHoursSchema),
    defaultValues: {
      openingTime: openingTime || '09:00',
      closingTime: closingTime || '18:00',
    },
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

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-4 sm:space-y-6'
    >
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Input
            label='Hora de Apertura'
            type='time'
            {...form.register('openingTime')}
            error={form.formState.errors.openingTime?.message}
            disabled={isPending}
          />
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Hora a la que abre el spa
          </p>
        </div>
        <div className='space-y-2'>
          <Input
            label='Hora de Cierre'
            type='time'
            {...form.register('closingTime')}
            error={form.formState.errors.closingTime?.message}
            disabled={isPending}
          />
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Hora a la que cierra el spa
          </p>
        </div>
      </div>

      <div className='flex justify-end gap-3 mt-8'>
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
