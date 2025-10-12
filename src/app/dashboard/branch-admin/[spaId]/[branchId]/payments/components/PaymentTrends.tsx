'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import type { PaymentStats } from '@/types/payments';

interface PaymentTrendsProps {
  stats: PaymentStats;
}

export function PaymentTrends({ stats }: PaymentTrendsProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate insights
  const insights = {
    topPaymentMethod: stats.byPaymentMethod[0] || null,
    commissionRate:
      stats.totalAmount > 0
        ? (stats.commissionsGenerated / stats.totalAmount) * 100
        : 0,
    discountRate:
      stats.totalAmount > 0
        ? (stats.discountsApplied / stats.totalAmount) * 100
        : 0,
    transactionFeeRate:
      stats.totalAmount > 0
        ? (stats.transactionFeesTotal / stats.totalAmount) * 100
        : 0,
    pendingCommissionRate:
      stats.commissionsGenerated > 0
        ? (stats.commissionsPending / stats.commissionsGenerated) * 100
        : 0,
    netRevenue:
      stats.totalAmount -
      stats.commissionsGenerated -
      stats.transactionFeesTotal,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis y Tendencias</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Insights y métricas clave del período
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Revenue Breakdown */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
              Desglose de Ingresos
            </h3>
            <div className="space-y-2">
              {/* Total Revenue */}
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium">Ingresos Totales</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(stats.totalAmount)}
                </span>
              </div>

              {/* Deductions */}
              <div className="pl-4 space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    - Comisiones Manicuristas (
                    {insights.commissionRate.toFixed(1)}%)
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(stats.commissionsGenerated)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    - Fees de Transacción (
                    {insights.transactionFeeRate.toFixed(2)}%)
                  </span>
                  <span className="text-sm font-semibold text-red-600">
                    {formatCurrency(stats.transactionFeesTotal)}
                  </span>
                </div>
              </div>

              {/* Net Revenue */}
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                <span className="text-sm font-semibold">
                  Ingreso Neto del Spa
                </span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(insights.netRevenue)}
                </span>
              </div>
            </div>
          </div>

          {/* Top Payment Method */}
          {insights.topPaymentMethod && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                Método de Pago Preferido
              </h3>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {insights.topPaymentMethod.methodName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {insights.topPaymentMethod.count} pagos
                    </p>
                  </div>
                  <Badge variant="default" className="bg-purple-600">
                    {insights.topPaymentMethod.percentage.toFixed(1)}% del total
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{
                      width: `${insights.topPaymentMethod.percentage}%`,
                    }}
                  />
                </div>
                <p className="text-right text-sm font-semibold text-purple-600 mt-2">
                  {formatCurrency(insights.topPaymentMethod.amount)}
                </p>
              </div>
            </div>
          )}

          {/* Discounts Analysis */}
          {stats.discountsApplied > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                Análisis de Descuentos
              </h3>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Total en Descuentos
                    </p>
                    <p className="text-xl font-bold text-amber-600">
                      {formatCurrency(stats.discountsApplied)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      % de Ingresos
                    </p>
                    <p className="text-xl font-bold text-amber-600">
                      {insights.discountRate.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  💡 Los descuentos representan{' '}
                  {insights.discountRate < 5
                    ? 'un nivel bajo'
                    : insights.discountRate < 10
                      ? 'un nivel moderado'
                      : 'un nivel alto'}{' '}
                  de descuentos aplicados
                </p>
              </div>
            </div>
          )}

          {/* Commission Status */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
              Estado de Comisiones
            </h3>
            <div className="space-y-3">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progreso de Pago</span>
                  <span>
                    {(100 - insights.pendingCommissionRate).toFixed(1)}% pagadas
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-green-600"
                      style={{
                        width: `${(stats.commissionsPaid / stats.commissionsGenerated) * 100 || 0}%`,
                      }}
                      title="Pagadas"
                    />
                    <div
                      className="bg-amber-600"
                      style={{
                        width: `${(stats.commissionsPending / stats.commissionsGenerated) * 100 || 0}%`,
                      }}
                      title="Pendientes"
                    />
                    <div
                      className="bg-gray-400"
                      style={{
                        width: `${(stats.commissionsCancelled / stats.commissionsGenerated) * 100 || 0}%`,
                      }}
                      title="Canceladas"
                    />
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded" />
                  <span>Pagadas: {formatCurrency(stats.commissionsPaid)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-600 rounded" />
                  <span>
                    Pendientes: {formatCurrency(stats.commissionsPending)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded" />
                  <span>
                    Canceladas: {formatCurrency(stats.commissionsCancelled)}
                  </span>
                </div>
              </div>

              {/* Alert if high pending */}
              {insights.pendingCommissionRate > 50 && (
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300 dark:border-amber-700">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    ⚠️ <strong>Atención:</strong> Hay un alto porcentaje de
                    comisiones pendientes de pago (
                    {insights.pendingCommissionRate.toFixed(1)}%). Considera
                    liquidar comisiones pronto.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
              Métricas Clave
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Ticket Promedio
                </p>
                <p className="text-lg font-bold">
                  {formatCurrency(stats.averagePayment)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Total Pagos
                </p>
                <p className="text-lg font-bold">{stats.totalPayments}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Métodos Usados
                </p>
                <p className="text-lg font-bold">
                  {stats.byPaymentMethod.length}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  % Comisión Promedio
                </p>
                <p className="text-lg font-bold">
                  {insights.commissionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
