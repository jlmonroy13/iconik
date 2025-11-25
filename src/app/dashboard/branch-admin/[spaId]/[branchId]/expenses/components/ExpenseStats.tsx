'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { ExpenseStats } from '@/types/expenses';

interface ExpenseStatsCardsProps {
  stats: ExpenseStats;
}

export function ExpenseStatsCards({ stats }: ExpenseStatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const paidPercentage =
    stats.totalAmount > 0 ? (stats.paidAmount / stats.totalAmount) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Total Gastos */}
      <Card>
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Total Gastos
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(stats.totalAmount)}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {stats.totalExpenses} gasto{stats.totalExpenses !== 1 && 's'}
          </p>
        </CardContent>
      </Card>

      {/* Pagado */}
      <Card>
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Pagado
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(stats.paidAmount)}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {paidPercentage.toFixed(1)}% del total
          </p>
        </CardContent>
      </Card>

      {/* Pendiente */}
      <Card>
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Pendiente
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-lg font-bold text-orange-600">
            {formatCurrency(stats.pendingAmount)}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {(100 - paidPercentage).toFixed(1)}% del total
          </p>
        </CardContent>
      </Card>

      {/* Vencido */}
      <Card>
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Vencido
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-lg font-bold text-red-600">
            {formatCurrency(stats.overdueAmount)}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {stats.overdue.length} gasto{stats.overdue.length !== 1 && 's'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
