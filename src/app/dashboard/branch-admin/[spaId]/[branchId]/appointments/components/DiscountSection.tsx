'use client';

import { Controller } from 'react-hook-form';
import { Input, SearchSelect, Switch } from '@/components/ui';
import type { Control, UseFormSetValue, FieldErrors } from 'react-hook-form';
import type { AppointmentFormData } from './types';

interface DiscountSectionProps {
  totalPrice: number;
  control: Control<AppointmentFormData>;
  setValue: UseFormSetValue<AppointmentFormData>;
  errors: FieldErrors<AppointmentFormData>;
  watchApplyDiscount: boolean;
  watchDiscountType?: 'amount' | 'percentage';
  watchDiscountPercentage?: number;
  calculatedDiscountAmount: number;
}

export function DiscountSection({
  totalPrice,
  control,
  setValue,
  errors,
  watchApplyDiscount,
  watchDiscountType,
  watchDiscountPercentage,
  calculatedDiscountAmount,
}: DiscountSectionProps) {
  if (totalPrice <= 0) {
    return null;
  }

  return (
    <div className="space-y-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Descuento
        </h3>
        <div className="flex items-center gap-2">
          <Controller
            name="applyDiscount"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value ?? false}
                onCheckedChange={checked => {
                  field.onChange(checked);
                  if (!checked) {
                    // Reset discount fields when disabling
                    setValue('discountType', undefined);
                    setValue('discountAmount', undefined);
                    setValue('discountPercentage', undefined);
                    setValue('discountReason', '');
                    setValue('discountAffectsCommission', false);
                  }
                }}
              />
            )}
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Aplicar descuento
          </label>
        </div>
      </div>

      {watchApplyDiscount && (
        <div className="space-y-3 pt-2 border-t border-purple-200 dark:border-purple-700">
          {/* Discount Type */}
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="discountType"
              control={control}
              render={({ field }) => (
                <SearchSelect
                  label="Tipo de descuento"
                  placeholder="Seleccionar tipo..."
                  options={[
                    { value: 'amount', label: 'Monto fijo' },
                    { value: 'percentage', label: 'Porcentaje' },
                  ]}
                  value={field.value || ''}
                  onChange={value => {
                    field.onChange(value);
                    // Clear the other field when switching types
                    if (value === 'amount') {
                      setValue('discountPercentage', undefined);
                    } else {
                      setValue('discountAmount', undefined);
                    }
                  }}
                  error={errors.discountType?.message}
                  required
                />
              )}
            />

            {/* Discount Value */}
            {watchDiscountType === 'amount' && (
              <Controller
                name="discountAmount"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Monto de descuento"
                    type="number"
                    step="0.01"
                    min="0"
                    max={totalPrice}
                    placeholder="0"
                    {...field}
                    value={field.value || ''}
                    onChange={e => {
                      const value = parseFloat(e.target.value) || 0;
                      field.onChange(value > totalPrice ? totalPrice : value);
                    }}
                    error={errors.discountAmount?.message}
                    required
                  />
                )}
              />
            )}

            {watchDiscountType === 'percentage' && (
              <Controller
                name="discountPercentage"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Porcentaje de descuento"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="0"
                    {...field}
                    value={field.value || ''}
                    onChange={e => {
                      const value = parseFloat(e.target.value) || 0;
                      field.onChange(value > 100 ? 100 : value);
                    }}
                    error={errors.discountPercentage?.message}
                    required
                  />
                )}
              />
            )}
          </div>

          {/* Discount Reason */}
          <Controller
            name="discountReason"
            control={control}
            render={({ field }) => (
              <Input
                label="Razón del descuento (opcional)"
                placeholder="Ej: Cliente frecuente, promoción, etc."
                {...field}
                error={errors.discountReason?.message}
              />
            )}
          />

          {/* Discount Affects Commission */}
          <div className="flex items-center gap-2 pt-1">
            <Controller
              name="discountAffectsCommission"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              El descuento afecta la comisión de la manicurista
            </label>
          </div>

          {/* Discount Preview */}
          {calculatedDiscountAmount > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Descuento aplicado:
                </span>
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  -
                  {calculatedDiscountAmount.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  })}
                  {watchDiscountType === 'percentage' &&
                    watchDiscountPercentage && (
                      <span className="ml-1 text-xs text-gray-500">
                        ({watchDiscountPercentage}%)
                      </span>
                    )}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
