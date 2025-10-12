'use client';

import { Card, CardContent } from '@/components/ui';
import type { PaymentStats } from '@/types/payments';

interface PaymentStatsProps {
  stats: PaymentStats;
}

export function PaymentStatsCards({ stats }: PaymentStatsProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Recaudado */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Recaudado
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.totalAmount)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.totalPayments} pagos
              </p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </CardContent>
      </Card>

      {/* Comisiones Generadas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Comisiones Generadas
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.commissionsGenerated)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total generado
              </p>
            </div>
            <span className="text-3xl">💸</span>
          </div>
        </CardContent>
      </Card>

      {/* Comisiones Pendientes */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Comisiones Pendientes
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {formatCurrency(stats.commissionsPending)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Por pagar
              </p>
            </div>
            <span className="text-3xl">⏳</span>
          </div>
        </CardContent>
      </Card>

      {/* Comisiones Pagadas */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Comisiones Pagadas
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.commissionsPaid)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Ya liquidadas
              </p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </CardContent>
      </Card>

      {/* Descuentos Aplicados */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Descuentos Aplicados
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.discountsApplied)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total en descuentos
              </p>
            </div>
            <span className="text-3xl">🏷️</span>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Fees */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Comisiones Transacciones
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(stats.transactionFeesTotal)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Fees de pasarelas
              </p>
            </div>
            <span className="text-3xl">🏦</span>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Promedio */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ticket Promedio
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.averagePayment)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Por pago
              </p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </CardContent>
      </Card>

      {/* Métodos de Pago Top */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Top Método de Pago
              </p>
              {stats.byPaymentMethod.length > 0 ? (
                <>
                  <p className="text-lg font-bold">
                    {stats.byPaymentMethod[0].methodName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stats.byPaymentMethod[0].percentage.toFixed(1)}% del total
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">Sin datos</p>
              )}
            </div>
            <span className="text-3xl">💳</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
