'use client';

import { Resolver, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Input,
  Select,
  Button,
  useNotifications,
  Textarea,
} from '@/components/ui';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { serviceFormSchema, type ServiceFormData } from '../schemas';
import type { Service } from '../types';

interface ServiceFormProps {
  service?: Service;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ServiceForm({
  service,
  onSubmit,
  isSubmitting,
}: ServiceFormProps) {
  const { showSuccess, showError } = useNotifications();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema) as Resolver<ServiceFormData>,
    defaultValues: service
      ? {
          ...service,
          kitCost: service.kitCost ?? undefined,
          taxRate: service.taxRate ?? 0,
          price: service.price ?? undefined,
          duration: service.duration ?? 0,
          isActive: service.isActive ?? true,
          imageUrl: service.imageUrl ?? '',
          description: service.description ?? '',
          recommendedReturnDays: service.recommendedReturnDays ?? 0,
        }
      : {
          isActive: true,
          kitCost: undefined,
          taxRate: 0,
          imageUrl: '',
          price: undefined,
          duration: 0,
          name: '',
          description: '',
          recommendedReturnDays: 0,
        },
  });

  const onSubmitForm = async (data: ServiceFormData) => {
    try {
      await onSubmit(data);
      showSuccess(
        service ? 'Servicio actualizado' : 'Servicio creado',
        service
          ? 'Los datos del servicio han sido actualizados exitosamente.'
          : 'El servicio ha sido creado exitosamente.'
      );
    } catch {
      showError(
        'Error al guardar',
        'Ocurrió un error al guardar los datos del servicio. Por favor, intenta de nuevo.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-4'>
      <Input
        label='Nombre'
        {...register('name')}
        error={errors.name?.message}
      />
      <Textarea
        label='Descripción'
        {...register('description')}
        error={errors.description?.message}
      />
      <Controller
        name='price'
        control={control}
        render={({ field, fieldState }) => (
          <CurrencyInput
            label='Precio'
            value={field.value ?? ''}
            onChange={field.onChange}
            error={fieldState.error?.message}
            placeholder='Ingresa el precio'
          />
        )}
      />
      <Input
        label='Duración (minutos)'
        type='number'
        {...register('duration', { valueAsNumber: true })}
        error={errors.duration?.message}
      />
      <Input
        label='Días recomendados para volver (opcional)'
        type='number'
        {...register('recommendedReturnDays', { valueAsNumber: true })}
        error={errors.recommendedReturnDays?.message}
      />
      <Controller
        name='kitCost'
        control={control}
        render={({ field, fieldState }) => (
          <CurrencyInput
            label='Costo del Kit (opcional)'
            value={field.value ?? ''}
            onChange={field.onChange}
            error={fieldState.error?.message}
            placeholder='Ingresa el costo del kit'
          />
        )}
      />
      <Input
        label='Tasa de Impuesto (opcional, ej: 0.19 para 19%)'
        type='number'
        {...register('taxRate', { valueAsNumber: true })}
        error={errors.taxRate?.message}
      />
      <Input
        label='URL de Imagen (opcional)'
        type='url'
        {...register('imageUrl')}
        error={errors.imageUrl?.message}
      />
      <Select
        label='Estado'
        {...register('isActive')}
        error={errors.isActive?.message}
      >
        <option value='true'>Activo</option>
        <option value='false'>Inactivo</option>
      </Select>
      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting
            ? 'Guardando...'
            : service
              ? 'Actualizar Servicio'
              : 'Crear Servicio'}
        </Button>
      </div>
    </form>
  );
}
