'use client';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui';
import {
  paymentMethodExtendedSchema,
  type PaymentMethodExtendedFormData,
} from '../schemas';
import type { PaymentMethod } from '../types';

interface PaymentMethodFormProps {
  method?: PaymentMethod;
  onSubmit: (data: PaymentMethodExtendedFormData) => Promise<void>;
  isSubmitting?: boolean;
}

function getDefaultValues(
  method?: PaymentMethod
): PaymentMethodExtendedFormData {
  return {
    name: method?.name || '',
    type: method?.type || '',
    isActive: typeof method?.isActive === 'boolean' ? method.isActive : true,
    icon: method?.icon || '',
    transactionFee: method?.transactionFee ?? 0,
  };
}

export function PaymentMethodForm({
  method,
  onSubmit,
  isSubmitting,
}: PaymentMethodFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PaymentMethodExtendedFormData>({
    resolver: zodResolver(paymentMethodExtendedSchema),
    defaultValues: getDefaultValues(method),
  });

  const onSubmitForm: SubmitHandler<
    PaymentMethodExtendedFormData
  > = async data => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-4'>
      <Input
        label='Nombre'
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label='Tipo (opcional)'
        {...register('type')}
        error={errors.type?.message}
      />
      <Input
        label='Ícono (opcional)'
        {...register('icon')}
        error={errors.icon?.message}
      />
      <Controller
        name='transactionFee'
        control={control}
        render={({ field, fieldState }) => (
          <Input
            label='Comisión (%)'
            type='number'
            min={0}
            max={100}
            step={0.1}
            value={field.value === 0 ? '' : field.value * 100}
            onChange={e => {
              const val = e.target.value;
              if (val === '') {
                field.onChange(0);
              } else {
                field.onChange(Number(val) / 100);
              }
            }}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name='isActive'
        control={control}
        render={({ field }) => (
          <div className='flex items-center gap-2'>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            <span className='text-sm'>Activo</span>
          </div>
        )}
      />
      <div className='flex justify-end pt-4'>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting
            ? 'Guardando...'
            : method
              ? 'Actualizar Método'
              : 'Crear Método'}
        </Button>
      </div>
    </form>
  );
}
