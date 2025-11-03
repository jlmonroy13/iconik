'use client';

import { Controller, UseFormRegister } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { SearchSelect } from '@/components/ui';
import type { Control, FieldErrors } from 'react-hook-form';
import type { AppointmentFormData } from './types';

interface ServiceFormItemProps {
  index: number;
  field: { id: string };
  control: Control<AppointmentFormData>;
  register: UseFormRegister<AppointmentFormData>;
  errors: FieldErrors<AppointmentFormData>;
  service: {
    serviceId: string;
    manicuristId: string;
    price: number;
    estimatedDuration: number;
  };
  availableServices: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
    type: string;
  }>;
  availableManicurists: Array<{ id: string; name: string }>;
  loadingManicurists: boolean;
  useSameManicurist: boolean;
  onServiceSelect: (index: number, serviceId: string) => void;
  onRemove: (index: number) => void;
}

export function ServiceFormItem({
  index,
  field: _field,
  control,
  register,
  errors,
  service,
  availableServices,
  availableManicurists,
  loadingManicurists,
  useSameManicurist,
  onServiceSelect,
  onRemove,
}: ServiceFormItemProps) {
  const isDisabled = !service.serviceId || loadingManicurists;

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Servicio {index + 1}
          </h4>
          {/* Duration Badge */}
          {service.estimatedDuration ? (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
              {service.estimatedDuration} min
            </span>
          ) : null}
          {/* Price Badge */}
          {service.price ? (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
              ${service.price.toLocaleString()}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
          aria-label="Eliminar servicio"
        >
          <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Service Selection */}
        <Controller
          name={`services.${index}.serviceId`}
          control={control}
          render={({ field: selectField }) => (
            <SearchSelect
              label="Servicio"
              placeholder="Seleccionar servicio..."
              options={Array.from(
                new Map(
                  availableServices.map(s => [
                    s.id,
                    {
                      value: s.id,
                      label: `${s.name} - $${s.price.toLocaleString()}`,
                      searchText: `${s.name} ${s.type}`,
                    },
                  ])
                ).values()
              )}
              value={selectField.value}
              onChange={value => {
                selectField.onChange(value);
                onServiceSelect(index, value);
              }}
              error={errors.services?.[index]?.serviceId?.message}
              required
            />
          )}
        />

        {/* Manicurist Selection (if not using same for all) */}
        {!useSameManicurist && (
          <Controller
            name={`services.${index}.manicuristId`}
            control={control}
            render={({ field: selectField }) => (
              <SearchSelect
                label="Manicurista"
                placeholder={
                  isDisabled
                    ? service.serviceId
                      ? loadingManicurists
                        ? 'Cargando manicuristas...'
                        : 'No hay manicuristas disponibles'
                      : 'Primero seleccione un servicio'
                    : 'Seleccionar manicurista...'
                }
                options={availableManicurists.map(m => ({
                  value: m.id,
                  label: m.name,
                }))}
                value={selectField.value}
                onChange={selectField.onChange}
                error={errors.services?.[index]?.manicuristId?.message}
                required
                disabled={isDisabled}
              />
            )}
          />
        )}

        {/* Hidden inputs to maintain form values */}
        <input
          type="hidden"
          {...register(`services.${index}.price`, {
            valueAsNumber: true,
          })}
        />
        <input
          type="hidden"
          {...register(`services.${index}.estimatedDuration`, {
            valueAsNumber: true,
          })}
        />
        {/* Error messages for hidden fields */}
        {errors.services?.[index]?.price?.message && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.services?.[index]?.price?.message}
          </p>
        )}
        {errors.services?.[index]?.estimatedDuration?.message && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400">
            {errors.services?.[index]?.estimatedDuration?.message}
          </p>
        )}
      </div>
    </div>
  );
}
