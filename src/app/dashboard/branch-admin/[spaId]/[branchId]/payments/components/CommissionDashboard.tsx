'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { PaymentListItem } from '@/types/payments';

interface CommissionDashboardProps {
  payments: PaymentListItem[];
  dateFrom?: Date;
  dateTo?: Date;
}

interface ManicuristCommissionStats {
  manicuristId: string;
  manicuristName: string;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  cancelledCommissions: number;
  numberOfServices: number;
  averageCommission: number;
  highestCommission: number;
  lowestCommission: number;
}

export function CommissionDashboard({
  payments,
  dateFrom,
  dateTo,
}: CommissionDashboardProps) {
  const [sortBy, setSortBy] = useState<'total' | 'pending' | 'services'>(
    'total'
  );

  // Calculate commission stats by manicurist
  const calculateStats = (): ManicuristCommissionStats[] => {
    const statsMap = new Map<string, ManicuristCommissionStats>();

    payments.forEach(payment => {
      if (!payment.commission) return;

      const manicuristId = payment.commission.manicuristId;
      const manicuristName = payment.commission.manicuristName;
      const commissionAmount = payment.commission.commissionAmount;
      const status = payment.commission.status;

      let stats = statsMap.get(manicuristId);
      if (!stats) {
        stats = {
          manicuristId,
          manicuristName,
          totalCommissions: 0,
          pendingCommissions: 0,
          paidCommissions: 0,
          cancelledCommissions: 0,
          numberOfServices: 0,
          averageCommission: 0,
          highestCommission: 0,
          lowestCommission: Infinity,
        };
        statsMap.set(manicuristId, stats);
      }

      stats.totalCommissions += commissionAmount;
      stats.numberOfServices++;

      if (status === 'PENDING') {
        stats.pendingCommissions += commissionAmount;
      } else if (status === 'PAID') {
        stats.paidCommissions += commissionAmount;
      } else if (status === 'CANCELLED') {
        stats.cancelledCommissions += commissionAmount;
      }

      if (commissionAmount > stats.highestCommission) {
        stats.highestCommission = commissionAmount;
      }
      if (commissionAmount < stats.lowestCommission) {
        stats.lowestCommission = commissionAmount;
      }
    });

    // Calculate averages
    statsMap.forEach(stats => {
      stats.averageCommission = stats.totalCommissions / stats.numberOfServices;
      if (stats.lowestCommission === Infinity) {
        stats.lowestCommission = 0;
      }
    });

    return Array.from(statsMap.values());
  };

  const stats = calculateStats();

  // Sort stats
  const sortedStats = [...stats].sort((a, b) => {
    switch (sortBy) {
      case 'total':
        return b.totalCommissions - a.totalCommissions;
      case 'pending':
        return b.pendingCommissions - a.pendingCommissions;
      case 'services':
        return b.numberOfServices - a.numberOfServices;
      default:
        return 0;
    }
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate totals
  const totals = stats.reduce(
    (acc, stat) => ({
      total: acc.total + stat.totalCommissions,
      pending: acc.pending + stat.pendingCommissions,
      paid: acc.paid + stat.paidCommissions,
      services: acc.services + stat.numberOfServices,
    }),
    { total: 0, pending: 0, paid: 0, services: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Dashboard de Comisiones por Manicurista</CardTitle>
            {(dateFrom || dateTo) && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {dateFrom && dateTo
                  ? `${dateFrom.toLocaleDateString('es-CO')} - ${dateTo.toLocaleDateString('es-CO')}`
                  : dateFrom
                    ? `Desde ${dateFrom.toLocaleDateString('es-CO')}`
                    : `Hasta ${dateTo?.toLocaleDateString('es-CO')}`}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setSortBy('total')}
              className={`text-sm ${
                sortBy === 'total'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              Por Total
            </Button>
            <Button
              onClick={() => setSortBy('pending')}
              className={`text-sm ${
                sortBy === 'pending'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              Por Pendiente
            </Button>
            <Button
              onClick={() => setSortBy('services')}
              className={`text-sm ${
                sortBy === 'services'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              Por Servicios
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {stats.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay comisiones en este período
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Los datos aparecerán cuando haya pagos con comisiones registradas
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Comisiones
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totals.total)}
                </p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pendientes
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(totals.pending)}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pagadas
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totals.paid)}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Servicios
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {totals.services}
                </p>
              </div>
            </div>

            {/* Manicurist Cards */}
            <div className="space-y-4">
              {sortedStats.map((stat, index) => (
                <div
                  key={stat.manicuristId}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {stat.manicuristName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stat.numberOfServices} servicio
                          {stat.numberOfServices !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(stat.totalCommissions)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total comisiones
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Pendientes
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="warning">
                          {formatCurrency(stat.pendingCommissions)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Pagadas
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">
                          {formatCurrency(stat.paidCommissions)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Promedio
                      </p>
                      <p className="font-semibold">
                        {formatCurrency(stat.averageCommission)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Más Alta
                      </p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(stat.highestCommission)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Más Baja
                      </p>
                      <p className="font-semibold text-orange-600">
                        {formatCurrency(stat.lowestCommission)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Estado de Comisiones</span>
                      <span>
                        {(
                          (stat.paidCommissions / stat.totalCommissions) *
                          100
                        ).toFixed(1)}
                        % pagadas
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-green-600"
                          style={{
                            width: `${(stat.paidCommissions / stat.totalCommissions) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-amber-600"
                          style={{
                            width: `${(stat.pendingCommissions / stat.totalCommissions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
