'use client';
import { useState } from 'react';
import { Button, useNotifications } from '@/components/ui';
import { Pencil, Trash, Plus, Target } from 'lucide-react';
import { SalesGoalModal } from './SalesGoalModal';
import { createSalesGoal, updateSalesGoal, deleteSalesGoal } from '../actions';
import type { SalesGoalFormValues } from '../schemas';

interface SalesGoal {
  id: string;
  name: string;
  type: 'REVENUE' | 'SERVICES' | 'CLIENTS' | 'APPOINTMENTS';
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  manicurist?: { name: string } | null;
  service?: { name: string } | null;
}

interface SalesGoalsListProps {
  goals: SalesGoal[];
}

const GOAL_TYPE_LABELS = {
  REVENUE: 'Ingresos',
  SERVICES: 'Servicios',
  CLIENTS: 'Clientes',
  APPOINTMENTS: 'Citas',
};

const PERIOD_LABELS = {
  DAILY: 'Diaria',
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensual',
  QUARTERLY: 'Trimestral',
  YEARLY: 'Anual',
};

export function SalesGoalsList({ goals }: SalesGoalsListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingGoal, setEditingGoal] = useState<
    (SalesGoalFormValues & { id?: string }) | undefined
  >(undefined);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [localGoals, setLocalGoals] = useState(goals);
  const { showSuccess, showError } = useNotifications();

  // Open modal for create
  const handleAdd = () => {
    setEditingGoal(undefined);
    setModalMode('create');
    setModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (goal: SalesGoal) => {
    setEditingGoal({
      name: goal.name,
      type: goal.type,
      period: goal.period,
      targetAmount: goal.targetAmount,
      startDate: goal.startDate.toISOString().split('T')[0],
      endDate: goal.endDate?.toISOString().split('T')[0],
      isActive: goal.isActive,
      manicuristId: goal.manicurist?.name ? undefined : undefined, // We'll need to get the ID
      serviceId: goal.service?.name ? undefined : undefined, // We'll need to get the ID
    });
    setModalMode('edit');
    setModalOpen(true);
  };

  // Add goal
  const handleCreate = async (data: SalesGoalFormValues) => {
    setLoadingId('new');
    const res = await createSalesGoal(data);
    if (res.success && res.data) {
      setLocalGoals([res.data, ...localGoals]);
      showSuccess('Meta creada', 'La meta de ventas fue creada correctamente.');
    } else {
      showError('Error', res.message || 'No se pudo crear la meta.');
    }
    setLoadingId(null);
  };

  // Update goal
  const handleUpdate = async (data: SalesGoalFormValues) => {
    if (!editingGoal?.id) return;
    setLoadingId(editingGoal.id);
    const res = await updateSalesGoal(editingGoal.id, data);
    if (res.success && res.data) {
      setLocalGoals(
        localGoals.map(goal => (goal.id === editingGoal.id ? res.data : goal))
      );
      showSuccess(
        'Meta actualizada',
        'La meta de ventas fue actualizada correctamente.'
      );
    } else {
      showError('Error', res.message || 'No se pudo actualizar la meta.');
    }
    setLoadingId(null);
  };

  // Delete goal
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta meta?')) return;
    setLoadingId(id);
    const res = await deleteSalesGoal(id);
    if (res.success) {
      setLocalGoals(localGoals.filter(goal => goal.id !== id));
      showSuccess(
        'Meta eliminada',
        'La meta de ventas fue eliminada correctamente.'
      );
    } else {
      showError('Error', res.message || 'No se pudo eliminar la meta.');
    }
    setLoadingId(null);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-end items-center mb-2'>
        <Button onClick={handleAdd} variant='primary' size='sm'>
          <Plus className='w-4 h-4 mr-1' /> Crear meta
        </Button>
      </div>
      <div className='divide-y rounded-lg border overflow-hidden bg-white dark:bg-gray-900'>
        {localGoals.length === 0 && (
          <div className='p-4 text-center text-gray-500'>
            No hay metas configuradas.
          </div>
        )}
        {localGoals.map(goal => {
          const progress = getProgressPercentage(
            goal.currentAmount,
            goal.targetAmount
          );
          const isOverdue =
            goal.endDate && new Date() > goal.endDate && progress < 100;

          return (
            <div
              key={goal.id}
              className='flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition'
            >
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-2'>
                  <Target className='w-4 h-4 text-blue-500' />
                  <span className='font-medium'>{goal.name}</span>
                  {!goal.isActive && (
                    <span className='bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium'>
                      Inactiva
                    </span>
                  )}
                  {isOverdue && (
                    <span className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium'>
                      Vencida
                    </span>
                  )}
                </div>

                <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2'>
                  <span>
                    {GOAL_TYPE_LABELS[goal.type]} • {PERIOD_LABELS[goal.period]}
                  </span>
                  {goal.manicurist && <span>• {goal.manicurist.name}</span>}
                  {goal.service && <span>• {goal.service.name}</span>}
                </div>

                <div className='flex items-center gap-4 text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>
                    Meta:{' '}
                    {goal.type === 'REVENUE'
                      ? formatCurrency(goal.targetAmount)
                      : goal.targetAmount.toLocaleString()}
                  </span>
                  <span className='text-gray-600 dark:text-gray-400'>
                    Actual:{' '}
                    {goal.type === 'REVENUE'
                      ? formatCurrency(goal.currentAmount)
                      : goal.currentAmount.toLocaleString()}
                  </span>
                  <span
                    className={`font-medium ${progress >= 100 ? 'text-green-600' : progress >= 75 ? 'text-yellow-600' : 'text-red-600'}`}
                  >
                    {progress.toFixed(1)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                  <div
                    className={`h-2 rounded-full transition-all ${
                      progress >= 100
                        ? 'bg-green-500'
                        : progress >= 75
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className='flex gap-2'>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => handleEdit(goal)}
                  disabled={loadingId === goal.id}
                >
                  <Pencil className='w-4 h-4' />
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => handleDelete(goal.id)}
                  disabled={loadingId === goal.id}
                >
                  <Trash className='w-4 h-4' />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para crear/editar */}
      <SalesGoalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={modalMode === 'create' ? handleCreate : handleUpdate}
        initialData={modalMode === 'edit' ? editingGoal : undefined}
        mode={modalMode}
      />
    </div>
  );
}
