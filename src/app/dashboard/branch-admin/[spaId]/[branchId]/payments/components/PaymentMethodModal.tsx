'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Switch from '@/components/ui/Switch';
import { Spinner } from '@/components/ui/Spinner';
import {
  createPaymentMethodSchema,
  type CreatePaymentMethodData,
} from '@/types/forms';
import type { PaymentMethodWithStats } from '@/types/payments';
import { createPaymentMethod, updatePaymentMethod } from '../actions';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaId: string;
  mode: 'create' | 'edit';
  paymentMethod?: PaymentMethodWithStats | null;
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  spaId,
  mode,
  paymentMethod,
}: PaymentMethodModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreatePaymentMethodData>({
    resolver: zodResolver(createPaymentMethodSchema),
    defaultValues: {
      name: '',
      type: '',
      icon: '',
      transactionFee: 0,
      isActive: true,
    },
  });

  // Reset form when modal opens or payment method changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && paymentMethod) {
        reset({
          name: paymentMethod.name,
          type: paymentMethod.type || '',
          icon: paymentMethod.icon || '',
          transactionFee: paymentMethod.transactionFee,
          isActive: paymentMethod.isActive,
        });
      } else {
        reset({
          name: '',
          type: '',
          icon: '',
          transactionFee: 0,
          isActive: true,
        });
      }
    }
  }, [isOpen, mode, paymentMethod, reset]);

  const onSubmit = async (data: CreatePaymentMethodData) => {
    setIsSubmitting(true);

    try {
      let result;

      if (mode === 'create') {
        result = await createPaymentMethod(spaId, {
          name: data.name,
          type: data.type || undefined,
          icon: data.icon || undefined,
          transactionFee: data.transactionFee,
          isActive: data.isActive,
        });
      } else if (paymentMethod) {
        result = await updatePaymentMethod(paymentMethod.id, spaId, {
          name: data.name,
          type: data.type || undefined,
          icon: data.icon || undefined,
          transactionFee: data.transactionFee,
          isActive: data.isActive,
        });
      }

      if (result?.success) {
        router.refresh();
        onClose();
      } else {
        alert(result?.error || 'Error al guardar método de pago');
      }
    } catch {
      alert('Error inesperado al guardar método de pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common icon suggestions with full data
  const iconSuggestions = [
    { label: 'Efectivo', value: '💵', type: 'Efectivo', fee: 0 },
    { label: 'Tarjeta', value: '💳', type: 'Tarjeta', fee: 0.035 },
    { label: 'Transferencia', value: '🏦', type: 'Digital', fee: 0 },
    { label: 'Datafono', value: '💰', type: 'Tarjeta', fee: 0.035 },
    { label: 'QR', value: '📱', type: 'Digital', fee: 0.02 },
    { label: 'Digital', value: '💻', type: 'Digital', fee: 0.02 },
    { label: 'Billetera', value: '👛', type: 'Digital', fee: 0.025 },
    { label: 'Cheque', value: '📝', type: 'Cheque', fee: 0 },
  ];

  // Common type suggestions
  const typeSuggestions = ['Efectivo', 'Digital', 'Tarjeta', 'Transferencia'];

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: (typeof iconSuggestions)[0]) => {
    setValue('name', suggestion.label);
    setValue('icon', suggestion.value);
    setValue('type', suggestion.type);
    setValue('transactionFee', suggestion.fee);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'create' ? 'Crear Método de Pago' : 'Editar Método de Pago'
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">
            Nombre <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Ej: Efectivo, Tarjeta Débito, Nequi..."
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Input
            id="type"
            {...register('type')}
            placeholder="Ej: Efectivo, Digital, Tarjeta..."
            list="type-suggestions"
            className={errors.type ? 'border-red-500' : ''}
          />
          <datalist id="type-suggestions">
            {typeSuggestions.map(type => (
              <option key={type} value={type} />
            ))}
          </datalist>
          {errors.type && (
            <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Opcional: Categoría del método de pago
          </p>
        </div>

        {/* Icon */}
        <div>
          <Label htmlFor="icon">Icono</Label>
          <Input
            id="icon"
            {...register('icon')}
            placeholder="Emoji o símbolo (Ej: 💵)"
            maxLength={4}
            className={errors.icon ? 'border-red-500' : ''}
          />
          {errors.icon && (
            <p className="text-sm text-red-500 mt-1">{errors.icon.message}</p>
          )}

          {/* Icon Suggestions */}
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-2">Sugerencias:</p>
            <div className="flex flex-wrap gap-2">
              {iconSuggestions.map(suggestion => (
                <button
                  key={suggestion.value}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  title={`${suggestion.label} - ${suggestion.type} (${(suggestion.fee * 100).toFixed(1)}%)`}
                >
                  <span className="mr-1">{suggestion.value}</span>
                  <span className="text-xs">{suggestion.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Fee */}
        <div>
          <Label htmlFor="transactionFee">
            Comisión de Transacción <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="transactionFee"
              type="number"
              step="0.001"
              min="0"
              max="1"
              {...register('transactionFee', { valueAsNumber: true })}
              placeholder="Ej: 0.035 para 3.5%"
              className={errors.transactionFee ? 'border-red-500' : ''}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              (0 - 1)
            </span>
          </div>
          {errors.transactionFee && (
            <p className="text-sm text-red-500 mt-1">
              {errors.transactionFee.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Ingrese el valor decimal (0.035 = 3.5%, 0.05 = 5%)
          </p>
        </div>

        {/* Transaction Fee Preview */}
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Vista Previa:</p>
          <Controller
            name="transactionFee"
            control={control}
            render={({ field }) => {
              const fee = field.value || 0;
              const percentage = (fee * 100).toFixed(2);
              const exampleAmount = 100000;
              const feeAmount = exampleAmount * fee;
              const finalAmount = exampleAmount - feeAmount;

              return (
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-gray-600 dark:text-gray-400">
                      Porcentaje:
                    </span>{' '}
                    <span className="font-semibold">{percentage}%</span>
                  </p>
                  <p>
                    <span className="text-gray-600 dark:text-gray-400">
                      En $100,000:
                    </span>{' '}
                    <span className="font-semibold">
                      ${feeAmount.toLocaleString('es-CO')}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600 dark:text-gray-400">
                      Recibirías:
                    </span>{' '}
                    <span className="font-semibold text-green-600">
                      ${finalAmount.toLocaleString('es-CO')}
                    </span>
                  </p>
                </div>
              );
            }}
          />
        </div>

        {/* Is Active */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div>
            <Label htmlFor="isActive">Estado Activo</Label>
            <p className="text-xs text-gray-500">
              {mode === 'create'
                ? 'El método estará disponible inmediatamente'
                : 'Desactivar ocultará este método de las opciones de pago'}
            </p>
          </div>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {mode === 'create' ? 'Creando...' : 'Actualizando...'}
              </>
            ) : mode === 'create' ? (
              'Crear Método'
            ) : (
              'Actualizar Método'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
