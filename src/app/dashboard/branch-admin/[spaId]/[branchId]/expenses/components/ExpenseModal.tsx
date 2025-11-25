'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Modal,
  Button,
  Input,
  Textarea,
  Select,
  Switch,
} from '@/components/ui';
import { createExpenseSchema, type CreateExpenseData } from '@/types/forms';
import {
  EXPENSE_TYPE_LABELS,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_FREQUENCY_LABELS,
  type ExpenseListItem,
} from '@/types/expenses';
import { createExpense, updateExpense } from '../actions';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaId: string;
  mode: 'create' | 'edit';
  expense?: ExpenseListItem | null;
}

export function ExpenseModal({
  isOpen,
  onClose,
  spaId,
  mode,
  expense,
}: ExpenseModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = mode === 'edit';

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateExpenseData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      name: expense?.name || '',
      description: expense?.description || '',
      amount: expense?.amount || 0,
      type: expense?.type || 'VARIABLE',
      category: expense?.category || 'OTHER',
      frequency: expense?.frequency || 'ONE_TIME',
      dueDate: expense?.dueDate
        ? new Date(expense.dueDate).toISOString().split('T')[0]
        : '',
      isActive: expense?.isActive ?? true,
    },
  });

  // Reset form when modal opens/closes or expense changes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: expense?.name || '',
        description: expense?.description || '',
        amount: expense?.amount || 0,
        type: expense?.type || 'VARIABLE',
        category: expense?.category || 'OTHER',
        frequency: expense?.frequency || 'ONE_TIME',
        dueDate: expense?.dueDate
          ? new Date(expense.dueDate).toISOString().split('T')[0]
          : '',
        isActive: expense?.isActive ?? true,
      });
      setError(null);
    }
  }, [isOpen, expense, reset]);

  const onSubmit = async (data: CreateExpenseData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;

      if (isEditing && expense) {
        result = await updateExpense(expense.id, spaId, data);
      } else {
        result = await createExpense(spaId, data);
      }

      if (result.success) {
        router.refresh();
        reset();
        onClose();
      } else {
        setError(result.error || 'Error al guardar el gasto');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { value: 'FIXED', label: EXPENSE_TYPE_LABELS.FIXED },
    { value: 'VARIABLE', label: EXPENSE_TYPE_LABELS.VARIABLE },
  ];

  const categoryOptions = Object.entries(EXPENSE_CATEGORY_LABELS).map(
    ([value, label]) => ({ value, label })
  );

  const frequencyOptions = Object.entries(EXPENSE_FREQUENCY_LABELS).map(
    ([value, label]) => ({ value, label })
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Gasto' : 'Nuevo Gasto'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Información Básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Información Básica
          </h3>

          <Input
            label="Nombre del Gasto *"
            {...register('name')}
            placeholder="Ej: Arriendo Local Mes de Diciembre"
            error={errors.name?.message}
            required
          />

          <Textarea
            label="Descripción"
            {...register('description')}
            placeholder="Descripción opcional del gasto"
            error={errors.description?.message}
            rows={2}
          />

          <Input
            label="Monto *"
            type="number"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            placeholder="0"
            error={errors.amount?.message}
            required
          />
        </div>

        {/* Clasificación */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Clasificación
          </h3>

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Tipo de Gasto *"
                value={field.value}
                onChange={field.onChange}
                error={errors.type?.message}
                required
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                label="Categoría *"
                value={field.value}
                onChange={field.onChange}
                error={errors.category?.message}
                required
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          />

          <Controller
            name="frequency"
            control={control}
            render={({ field }) => (
              <Select
                label="Frecuencia *"
                value={field.value}
                onChange={field.onChange}
                error={errors.frequency?.message}
                required
              >
                {frequencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          />
        </div>

        {/* Fecha y Estado */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Fecha y Estado
          </h3>

          <Input
            label="Fecha de Vencimiento"
            type="date"
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />

          <div className="flex items-center gap-3">
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gasto activo
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting
              ? 'Guardando...'
              : isEditing
                ? 'Actualizar Gasto'
                : 'Crear Gasto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
