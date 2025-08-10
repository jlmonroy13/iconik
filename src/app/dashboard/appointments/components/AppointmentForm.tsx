'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Input,
  Select,
  Button,
  Textarea,
  SearchSelect,
  useNotifications,
} from '@/components/ui';
import { appointmentFormSchema, type AppointmentFormData } from '../schemas';
import { Plus, Trash2 } from 'lucide-react';
import type { AppointmentWithDetails } from '@/types';
import { CurrencyInput } from '@/components/ui/CurrencyInput';

interface Option {
  id: string;
  name: string;
}

interface AppointmentFormProps {
  appointment?: AppointmentWithDetails;
  clients: Option[];
  manicurists: Option[];
  services: Option[];
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  onCreateClient?: (initialName?: string) => void;
  isSubmitting?: boolean;
}

export function AppointmentForm({
  appointment,
  clients,
  manicurists,
  services,
  onSubmit,
  onCreateClient,
  isSubmitting,
}: AppointmentFormProps) {
  const { showSuccess, showError } = useNotifications();

  const defaultValues: AppointmentFormData = appointment
    ? {
        clientId: appointment.clientId,
        isScheduled: appointment.isScheduled,
        scheduledAt: new Date(appointment.scheduledAt),
        status: appointment.status,
        notes: appointment.notes || '',
        services: appointment.services.map(service => ({
          serviceId: service.serviceId,
          manicuristId: service.manicuristId,
          price: service.price ?? 0,
        })),
      }
    : {
        clientId: '',
        isScheduled: true,
        scheduledAt: new Date(),
        status: 'SCHEDULED',
        notes: '',
        services: [
          {
            serviceId: services.length > 0 ? services[0].id : '',
            manicuristId: manicurists.length > 0 ? manicurists[0].id : '',
            price: 0,
          },
        ],
      };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services',
  });

  const clientId = watch('clientId');
  const status = watch('status');

  const onSubmitForm = async (data: AppointmentFormData) => {
    try {
      await onSubmit(data);
      showSuccess(
        appointment ? 'Cita actualizada' : 'Cita creada',
        appointment
          ? 'Los datos de la cita han sido actualizados exitosamente.'
          : 'La cita ha sido creada exitosamente.'
      );
    } catch {
      showError(
        'Error al guardar',
        'Ocurrió un error al guardar los datos de la cita. Por favor, intenta de nuevo.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-4'>
      <SearchSelect
        label='Cliente'
        options={clients}
        value={clientId || ''}
        onChange={value => setValue('clientId', value)}
        onCreateNew={() => onCreateClient?.()}
        error={errors.clientId?.message}
        placeholder='Selecciona un cliente...'
      />
      <Input
        label='Fecha y hora'
        type='datetime-local'
        {...register('scheduledAt', { valueAsDate: true })}
        error={errors.scheduledAt?.message}
      />
      <Select
        label='Estado'
        {...register('status')}
        value={status}
        error={errors.status?.message}
      >
        <option value='SCHEDULED'>Pendiente</option>
        <option value='CONFIRMED'>Confirmada</option>
        <option value='COMPLETED'>Completada</option>
        <option value='CANCELLED'>Cancelada</option>
      </Select>
      <Textarea
        label='Notas'
        {...register('notes')}
        error={errors.notes?.message}
      />
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <span className='font-medium'>Servicios</span>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() =>
              append({
                serviceId: services.length > 0 ? services[0].id : '',
                manicuristId: manicurists.length > 0 ? manicurists[0].id : '',
                price: 0,
              })
            }
            className='h-8'
          >
            <Plus className='h-4 w-4 mr-1' /> Agregar servicio
          </Button>
        </div>
        {fields.map((field, idx) => (
          <div
            key={field.id}
            className='flex gap-2 items-end border-b pb-2 mb-2'
          >
            <Select
              label='Servicio'
              {...register(`services.${idx}.serviceId` as const)}
              error={errors.services?.[idx]?.serviceId?.message}
              className='w-1/3'
            >
              <option value=''>Selecciona...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Select
              label='Manicurista'
              {...register(`services.${idx}.manicuristId` as const)}
              error={errors.services?.[idx]?.manicuristId?.message}
              className='w-1/3'
            >
              <option value=''>Selecciona...</option>
              {manicurists.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
            <Controller
              name={`services.${idx}.price` as const}
              control={control}
              render={({ field, fieldState }) => (
                <CurrencyInput
                  label='Precio'
                  value={field.value === 0 ? '' : field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  className='w-1/4'
                  placeholder='Precio'
                />
              )}
            />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => remove(idx)}
              className='h-8'
              aria-label='Eliminar servicio'
            >
              <Trash2 className='h-4 w-4 text-destructive' />
            </Button>
          </div>
        ))}
        {errors.services?.message && (
          <div className='text-destructive text-sm mt-1'>
            {errors.services.message}
          </div>
        )}
      </div>
      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting
            ? 'Guardando...'
            : appointment
              ? 'Actualizar Cita'
              : 'Crear Cita'}
        </Button>
      </div>
    </form>
  );
}
