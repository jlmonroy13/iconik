'use client';

import { Controller } from 'react-hook-form';
import { Button, Input, SearchSelect, Switch, Textarea } from '@/components/ui';
import type {
  Control,
  UseFormRegister,
  UseFormClearErrors,
  FieldErrors,
} from 'react-hook-form';
import type { AppointmentFormData } from './types';

interface BasicInformationSectionProps {
  control: Control<AppointmentFormData>;
  register: UseFormRegister<AppointmentFormData>;
  clearErrors: UseFormClearErrors<AppointmentFormData>;
  errors: FieldErrors<AppointmentFormData>;
  isScheduled: boolean;
  clientsList: Array<{
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  }>;
  onOpenClientModal: () => void;
}

export function BasicInformationSection({
  control,
  register,
  clearErrors,
  errors,
  isScheduled,
  clientsList,
  onOpenClientModal,
}: BasicInformationSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Información Básica
        </h3>
        <div className="flex items-center gap-2">
          <Controller
            name="isScheduled"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value ?? true}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Cita agendada{' '}
            {isScheduled ? '(activado)' : '(desactivado - walk-in)'}
          </label>
        </div>
      </div>

      {/* Walk-in Info Message */}
      {!isScheduled && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <p className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
            <span>ℹ️</span>
            <span>
              <strong>Walk-in:</strong> La cita comenzará inmediatamente sin
              necesidad de agendar una hora específica.
            </span>
          </p>
        </div>
      )}

      {/* Client Selection */}
      <div className="space-y-1.5">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <SearchSelect
                  label="Cliente"
                  placeholder="Buscar cliente..."
                  options={clientsList.map(c => ({
                    value: c.id,
                    label: `${c.name} - ${c.phone}`,
                    searchText: `${c.name} ${c.phone} ${c.email || ''}`,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.clientId?.message}
                  required
                />
              )}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={onOpenClientModal}
            className="whitespace-nowrap"
          >
            + Crear Cliente
          </Button>
        </div>
      </div>

      {/* Date and Time */}
      {isScheduled && (
        <Input
          label="Fecha y Hora"
          type="datetime-local"
          {...register('scheduledAt', {
            onChange: () => {
              // Clear error when user changes the date
              if (errors.scheduledAt?.type === 'manual') {
                clearErrors('scheduledAt');
              }
            },
          })}
          error={errors.scheduledAt?.message}
          required
        />
      )}

      {/* Notes */}
      <Textarea
        label="Notas"
        placeholder="Notas adicionales sobre la cita..."
        {...register('notes')}
        error={errors.notes?.message}
        rows={2}
      />
    </div>
  );
}
