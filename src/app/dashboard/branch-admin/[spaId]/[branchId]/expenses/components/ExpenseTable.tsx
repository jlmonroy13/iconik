'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ExpenseListItem } from '@/types/expenses';
import {
  EXPENSE_TYPE_LABELS,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_FREQUENCY_LABELS,
} from '@/types/expenses';

interface ExpenseTableProps {
  expenses: ExpenseListItem[];
  onView: (expenseId: string) => void;
  onPay: (expense: ExpenseListItem) => void;
  onEdit: (expense: ExpenseListItem) => void;
}

export function ExpenseTable({
  expenses,
  onView,
  onPay,
  onEdit,
}: ExpenseTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = (expense: ExpenseListItem) => {
    if (expense.isPaid || !expense.dueDate) return false;
    return new Date(expense.dueDate) < new Date();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Gasto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tipo/Categoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Monto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Vencimiento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {expenses.map(expense => (
            <tr
              key={expense.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {expense.name}
                  </div>
                  {expense.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {expense.description}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {EXPENSE_FREQUENCY_LABELS[expense.frequency]}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <Badge variant="default" className="mb-1">
                    {EXPENSE_TYPE_LABELS[expense.type]}
                  </Badge>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {EXPENSE_CATEGORY_LABELS[expense.category]}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(expense.amount)}
                  </div>
                  {expense.totalPaid > 0 && (
                    <>
                      <div className="text-xs text-green-600">
                        Pagado: {formatCurrency(expense.totalPaid)}
                      </div>
                      {expense.remainingAmount > 0 && (
                        <div className="text-xs text-red-600">
                          Pend: {formatCurrency(expense.remainingAmount)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {formatDate(expense.dueDate)}
                </div>
                {isOverdue(expense) && (
                  <Badge variant="destructive" className="mt-1 text-xs">
                    Vencido
                  </Badge>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <Badge
                    variant={expense.isPaid ? 'success' : 'warning'}
                    className="w-fit"
                  >
                    {expense.isPaid ? 'Pagado' : 'Pendiente'}
                  </Badge>
                  {!expense.isActive && (
                    <Badge variant="default" className="w-fit">
                      Inactivo
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  {!expense.isPaid && (
                    <Button
                      onClick={() => onPay(expense)}
                      className="bg-green-600 hover:bg-green-700 text-xs"
                      size="sm"
                    >
                      Pagar
                    </Button>
                  )}
                  <Button
                    onClick={() => onView(expense.id)}
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                  >
                    Ver
                  </Button>
                  <Button
                    onClick={() => onEdit(expense)}
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                  >
                    Editar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
