'use client';

import { Controller } from 'react-hook-form';
import { Button, SearchSelect, Switch } from '@/components/ui';
import type {
  Control,
  UseFieldArrayReturn,
  UseFormWatch,
  UseFormRegister,
  FieldErrors,
} from 'react-hook-form';
import type { AppointmentFormData } from './types';
import { ServiceFormItem } from './ServiceFormItem';

interface ServicesSectionProps {
  control: Control<AppointmentFormData>;
  watch: UseFormWatch<AppointmentFormData>;
  fields: UseFieldArrayReturn<AppointmentFormData, 'services'>['fields'];
  register: UseFormRegister<AppointmentFormData>;
  errors: FieldErrors<AppointmentFormData>;
  formData: {
    services: Array<{
      id: string;
      name: string;
      price: number;
      duration: number;
      type: string;
    }>;
    manicurists: Array<{
      id: string;
      name: string;
    }>;
  };
  filteredServices: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
    type: string;
  }>;
  useSameManicurist: boolean;
  availableManicurists: Record<number, Array<{ id: string; name: string }>>;
  loadingManicurists: Record<number, boolean>;
  loadingManicuristServices: boolean;
  onAddService: () => void;
  onRemoveService: (index: number) => void;
  onServiceSelect: (index: number, serviceId: string) => void;
}

export function ServicesSection({
  control,
  watch,
  fields,
  register,
  errors,
  formData,
  filteredServices,
  useSameManicurist,
  availableManicurists,
  loadingManicurists,
  loadingManicuristServices: _loadingManicuristServices,
  onAddService,
  onRemoveService,
  onServiceSelect,
}: ServicesSectionProps) {
  const watchServices = watch('services');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Servicios
          </h3>
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
            {fields.length}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-end">
          {fields.length > 1 && (
            <div className="flex items-center gap-2">
              <Controller
                name="useSameManicurist"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Usar la misma manicurista
              </label>
            </div>
          )}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onAddService}
          >
            + Agregar Servicio
          </Button>
        </div>
      </div>

      {/* Primary Manicurist Selection (when toggle is active) */}
      {useSameManicurist && fields.length > 1 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <Controller
            name="primaryManicuristId"
            control={control}
            render={({ field }) => (
              <SearchSelect
                label="Manicurista para todos los servicios"
                placeholder="Seleccionar manicurista..."
                options={formData.manicurists.map(m => ({
                  value: m.id,
                  label: m.name,
                }))}
                value={field.value || ''}
                onChange={field.onChange}
                required={useSameManicurist}
              />
            )}
          />
        </div>
      )}

      {/* Services List */}
      {fields.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
            No hay servicios agregados a esta cita
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onAddService}
          >
            Agregar Primer Servicio
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const service = watchServices?.[index] || {
              serviceId: '',
              manicuristId: '',
              price: 0,
              estimatedDuration: 0,
            };

            // Use filtered services if using same manicurist, otherwise use all services
            const availableServices =
              useSameManicurist && filteredServices.length > 0
                ? filteredServices
                : formData.services;

            return (
              <ServiceFormItem
                key={field.id}
                index={index}
                field={field}
                control={control}
                register={register}
                errors={errors}
                service={service}
                availableServices={availableServices}
                availableManicurists={availableManicurists[index] || []}
                loadingManicurists={loadingManicurists[index] || false}
                useSameManicurist={useSameManicurist}
                onServiceSelect={onServiceSelect}
                onRemove={onRemoveService}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
