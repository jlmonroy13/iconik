'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SalesGoalFormValues } from '../schemas';
import { Button, Input, Modal, Select } from '@/components/ui';

interface SalesGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SalesGoalFormValues) => Promise<void>;
  initialData?: SalesGoalFormValues & { id?: string };
  mode: 'create' | 'edit';
}

const GOAL_TYPES = [
  { value: 'REVENUE', label: 'Ingresos' },
  { value: 'SERVICES', label: 'Servicios' },
  { value: 'CLIENTS', label: 'Clientes' },
  { value: 'APPOINTMENTS', label: 'Citas' },
];

const PERIODS = [
  { value: 'DAILY', label: 'Diaria' },
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensual' },
  { value: 'QUARTERLY', label: 'Trimestral' },
  { value: 'YEARLY', label: 'Anual' },
];

export function SalesGoalModal({
  open,
  onClose,
  onSubmit,
  initialData,
  mode,
}: SalesGoalModalProps) {
  const form = useForm<SalesGoalFormValues>({
    resolver: zodResolver(SalesGoalFormValues),
    defaultValues: initialData || {
      name: '',
      type: 'REVENUE',
      period: 'MONTHLY',
      targetAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true,
      manicuristId: '',
      serviceId: '',
    },
  });

  const handleSubmit = async (data: SalesGoalFormValues) => {
    await onSubmit(data);
    onClose();
    form.reset();
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={
        mode === 'create' ? 'Crear Meta de Ventas' : 'Editar Meta de Ventas'
      }
      description='Configura una nueva meta de ventas para tu spa'
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <div className='space-y-2'>
          <Input
            label='Nombre de la Meta'
            placeholder='Ej: Meta mensual de ingresos'
            {...form.register('name')}
            error={form.formState.errors.name?.message}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Select
              label='Tipo de Meta'
              value={form.watch('type')}
              onChange={e =>
                form.setValue(
                  'type',
                  e.target.value as
                    | 'REVENUE'
                    | 'SERVICES'
                    | 'CLIENTS'
                    | 'APPOINTMENTS'
                )
              }
              error={form.formState.errors.type?.message}
            >
              {GOAL_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>

          <div className='space-y-2'>
            <Select
              label='Período'
              value={form.watch('period')}
              onChange={e =>
                form.setValue(
                  'period',
                  e.target.value as
                    | 'DAILY'
                    | 'WEEKLY'
                    | 'MONTHLY'
                    | 'QUARTERLY'
                    | 'YEARLY'
                )
              }
              error={form.formState.errors.period?.message}
            >
              {PERIODS.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className='space-y-2'>
          <Input
            label='Monto Objetivo'
            type='number'
            step='0.01'
            min='0'
            placeholder='0'
            {...form.register('targetAmount', { valueAsNumber: true })}
            error={form.formState.errors.targetAmount?.message}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Input
              label='Fecha de Inicio'
              type='date'
              {...form.register('startDate')}
              error={form.formState.errors.startDate?.message}
            />
          </div>

          <div className='space-y-2'>
            <Input
              label='Fecha de Fin (opcional)'
              type='date'
              {...form.register('endDate')}
              error={form.formState.errors.endDate?.message}
            />
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div>
            <label className='text-sm font-medium'>Meta Activa</label>
            <p className='text-sm text-gray-500'>
              La meta se mostrará en el dashboard
            </p>
          </div>
          <div className='flex items-center'>
            <input
              type='checkbox'
              checked={form.watch('isActive')}
              onChange={e => form.setValue('isActive', e.target.checked)}
              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
            />
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-4 border-t'>
          <Button type='button' variant='secondary' onClick={handleClose}>
            Cancelar
          </Button>
          <Button type='submit' disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Guardando...'
              : mode === 'create'
                ? 'Crear Meta'
                : 'Actualizar Meta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
