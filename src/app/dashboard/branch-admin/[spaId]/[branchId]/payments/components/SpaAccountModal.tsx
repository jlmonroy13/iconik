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
import {
  createSpaAccountSchema,
  type CreateSpaAccountData,
} from '@/types/forms';
import { ACCOUNT_TYPE_LABELS } from '@/types/expenses';
import type { SpaAccountWithStats } from '@/types/spaAccounts';
import { createSpaAccount, updateSpaAccount } from '../actions';

interface SpaAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaId: string;
  mode: 'create' | 'edit';
  spaAccount?: SpaAccountWithStats | null;
  branches?: Array<{ id: string; name: string }>;
}

export function SpaAccountModal({
  isOpen,
  onClose,
  spaId,
  mode,
  spaAccount,
  branches = [],
}: SpaAccountModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = mode === 'edit';

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateSpaAccountData>({
    resolver: zodResolver(createSpaAccountSchema),
    defaultValues: {
      name: spaAccount?.name || '',
      description: spaAccount?.description || '',
      type: spaAccount?.type || 'CASH',
      bank: spaAccount?.bank || '',
      accountNumber: spaAccount?.accountNumber || '',
      balance: spaAccount?.balance || 0,
      currency: spaAccount?.currency || 'COP',
      isActive: spaAccount?.isActive ?? true,
      branchId: spaAccount?.branchId || '',
    },
  });

  const watchType = watch('type');

  // Reset form when modal opens/closes or account changes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: spaAccount?.name || '',
        description: spaAccount?.description || '',
        type: spaAccount?.type || 'CASH',
        bank: spaAccount?.bank || '',
        accountNumber: spaAccount?.accountNumber || '',
        balance: spaAccount?.balance || 0,
        currency: spaAccount?.currency || 'COP',
        isActive: spaAccount?.isActive ?? true,
        branchId: spaAccount?.branchId || '',
      });
      setError(null);
    }
  }, [isOpen, spaAccount, reset]);

  const onSubmit = async (data: CreateSpaAccountData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let result;

      if (isEditing && spaAccount) {
        result = await updateSpaAccount(spaAccount.id, spaId, data);
      } else {
        result = await createSpaAccount(spaId, data);
      }

      if (result.success) {
        router.refresh();
        reset();
        onClose();
      } else {
        setError(result.error || 'Error al guardar la cuenta');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const accountTypeOptions = [
    { value: 'BANK_ACCOUNT', label: ACCOUNT_TYPE_LABELS.BANK_ACCOUNT },
    { value: 'CASH', label: ACCOUNT_TYPE_LABELS.CASH },
    { value: 'DIGITAL_WALLET', label: ACCOUNT_TYPE_LABELS.DIGITAL_WALLET },
    { value: 'CREDIT_CARD', label: ACCOUNT_TYPE_LABELS.CREDIT_CARD },
  ];

  const showBankFields =
    watchType === 'BANK_ACCOUNT' || watchType === 'DIGITAL_WALLET';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Cuenta del Spa' : 'Nueva Cuenta del Spa'}
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
            label="Nombre de la Cuenta *"
            {...register('name')}
            placeholder="Ej: Cuenta Bancolombia Ahorros"
            error={errors.name?.message}
            required
          />

          <Textarea
            label="Descripción"
            {...register('description')}
            placeholder="Descripción opcional de la cuenta"
            error={errors.description?.message}
            rows={2}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Tipo de Cuenta *"
                options={accountTypeOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.type?.message}
                required
              />
            )}
          />
        </div>

        {/* Información Bancaria/Financiera */}
        {showBankFields && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Información Bancaria
            </h3>

            <Input
              label="Banco/Entidad"
              {...register('bank')}
              placeholder="Ej: Bancolombia, Davivienda, Nequi"
              error={errors.bank?.message}
            />

            <Input
              label="Número de Cuenta"
              {...register('accountNumber')}
              placeholder="Número de cuenta o teléfono"
              error={errors.accountNumber?.message}
            />
          </div>
        )}

        {/* Balance y Configuración */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Balance y Configuración
          </h3>

          <Input
            label="Balance Inicial *"
            type="number"
            step="0.01"
            {...register('balance', { valueAsNumber: true })}
            placeholder="0"
            error={errors.balance?.message}
            required
          />

          <Input
            label="Moneda"
            {...register('currency')}
            placeholder="COP"
            error={errors.currency?.message}
          />

          {branches.length > 0 && (
            <Controller
              name="branchId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Sede (Opcional)"
                  options={[
                    {
                      value: '',
                      label: 'Cuenta Corporativa (Todas las sedes)',
                    },
                    ...branches.map(branch => ({
                      value: branch.id,
                      label: branch.name,
                    })),
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.branchId?.message}
                />
              )}
            />
          )}

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
              Cuenta activa
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
                ? 'Actualizar Cuenta'
                : 'Crear Cuenta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
