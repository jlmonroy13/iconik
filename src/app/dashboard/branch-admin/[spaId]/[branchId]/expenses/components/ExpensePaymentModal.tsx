'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Modal, Button, Input, Textarea, Select } from '@/components/ui';
import {
  createExpensePaymentSchema,
  type CreateExpensePaymentData,
} from '@/types/forms';
import type { ExpenseListItem } from '@/types/expenses';
import type { SpaAccountDropdown } from '@/types/spaAccounts';
import { ACCOUNT_TYPE_LABELS } from '@/types/expenses';
import { registerExpensePayment } from '../actions';

interface ExpensePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaId: string;
  expense: ExpenseListItem;
  spaAccounts: SpaAccountDropdown[];
}

export function ExpensePaymentModal({
  isOpen,
  onClose,
  spaId,
  expense,
  spaAccounts,
}: ExpensePaymentModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] =
    useState<SpaAccountDropdown | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateExpensePaymentData>({
    resolver: zodResolver(createExpensePaymentSchema),
    defaultValues: {
      expenseId: expense.id,
      spaAccountId: '',
      amount: expense.remainingAmount,
      paidAt: new Date().toISOString().split('T')[0],
      reference: '',
      notes: '',
    },
  });

  const watchAccountId = watch('spaAccountId');

  // Update selected account when account ID changes
  useEffect(() => {
    if (watchAccountId) {
      const account = spaAccounts.find(a => a.id === watchAccountId);
      setSelectedAccount(account || null);
    } else {
      setSelectedAccount(null);
    }
  }, [watchAccountId, spaAccounts]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      reset({
        expenseId: expense.id,
        spaAccountId: '',
        amount: expense.remainingAmount,
        paidAt: new Date().toISOString().split('T')[0],
        reference: '',
        notes: '',
      });
      setError(null);
      setSelectedAccount(null);
    }
  }, [isOpen, expense, reset]);

  const onSubmit = async (data: CreateExpensePaymentData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await registerExpensePayment(spaId, data);

      if (result.success) {
        router.refresh();
        reset();
        onClose();
      } else {
        setError(result.error || 'Error al registrar el pago');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Active accounts
  const activeAccounts = spaAccounts.filter(a => a.isActive);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Pago de Gasto"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Expense Info */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {expense.name}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-blue-700 dark:text-blue-300">
                Monto Total:
              </span>
              <p className="font-bold">{formatCurrency(expense.amount)}</p>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300">Pagado:</span>
              <p className="font-bold text-green-600">
                {formatCurrency(expense.totalPaid)}
              </p>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300">
                Pendiente:
              </span>
              <p className="font-bold text-red-600">
                {formatCurrency(expense.remainingAmount)}
              </p>
            </div>
            <div>
              <span className="text-blue-700 dark:text-blue-300">Pagos:</span>
              <p className="font-bold">{expense.paymentsCount}</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Detalles del Pago
          </h3>

          <Controller
            name="spaAccountId"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  label="Cuenta del Spa *"
                  options={[
                    { value: '', label: 'Seleccionar cuenta...' },
                    ...activeAccounts.map(account => ({
                      value: account.id,
                      label: `${account.name} - ${ACCOUNT_TYPE_LABELS[account.type]} ${
                        account.bank ? `(${account.bank})` : ''
                      }`,
                    })),
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.spaAccountId?.message}
                  required
                />
                {selectedAccount && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Saldo disponible:</span>{' '}
                      <span
                        className={
                          selectedAccount.balance >= expense.remainingAmount
                            ? 'text-green-600 font-bold'
                            : 'text-red-600 font-bold'
                        }
                      >
                        {formatCurrency(selectedAccount.balance)}
                      </span>
                    </p>
                    {selectedAccount.balance < expense.remainingAmount && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        ⚠️ Saldo insuficiente para pagar el total pendiente
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          />

          <Input
            label="Monto a Pagar *"
            type="number"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            placeholder="0"
            error={errors.amount?.message}
            helperText={`Máximo: ${formatCurrency(expense.remainingAmount)}`}
            required
          />

          <Input
            label="Fecha de Pago *"
            type="date"
            {...register('paidAt')}
            error={errors.paidAt?.message}
            required
          />

          <Input
            label="Referencia"
            {...register('reference')}
            placeholder="Número de transferencia, cheque, etc."
            error={errors.reference?.message}
          />

          <Textarea
            label="Notas"
            {...register('notes')}
            placeholder="Notas adicionales sobre este pago"
            error={errors.notes?.message}
            rows={2}
          />
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
            {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
