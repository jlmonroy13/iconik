'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui';
import { PaymentStatsCards } from './PaymentStats';
import { PaymentTable } from './PaymentTable';
import { PaymentDetailModal } from './PaymentDetailModal';
import { PaymentFiltersAdvanced } from './PaymentFiltersAdvanced';
import { PaymentMethodsManager } from './PaymentMethodsManager';
import { SpaAccountsManager } from './SpaAccountsManager';
import { CommissionDashboard } from './CommissionDashboard';
import { PaymentExport } from './PaymentExport';
import { PaymentTrends } from './PaymentTrends';
import type {
  PaymentListItem,
  PaymentStats,
  PaymentPaginationInfo,
  PaymentBranchInfo,
  PaymentFilters,
  PaymentMethodWithStats,
} from '@/types/payments';
import type { SpaAccountWithStats } from '@/types/spaAccounts';

interface PaymentsClientProps {
  payments: PaymentListItem[];
  stats: PaymentStats;
  paymentMethods: PaymentMethodWithStats[];
  spaAccounts: SpaAccountWithStats[];
  branches: Array<{ id: string; name: string; code: string }>;
  branch: PaymentBranchInfo;
  spaId: string;
  branchId: string;
  pagination: PaymentPaginationInfo;
  filters: PaymentFilters;
}

export function PaymentsClient({
  payments,
  stats,
  paymentMethods,
  spaAccounts,
  branches,
  branch,
  spaId,
  branchId,
  pagination,
  filters,
}: PaymentsClientProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  // Tab state
  const [activeTab, setActiveTab] = useState<
    'payments' | 'methods' | 'accounts' | 'commissions' | 'trends'
  >('payments');

  // Modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );

  // Filter states
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [dateFrom, setDateFrom] = useState(
    filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''
  );
  const [dateTo, setDateTo] = useState(
    filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''
  );
  const [paymentMethodId, setPaymentMethodId] = useState(
    filters.paymentMethodId || ''
  );
  const [commissionStatus, setCommissionStatus] = useState(
    filters.commissionStatus || 'ALL'
  );
  const [minAmount, setMinAmount] = useState(
    filters.minAmount ? filters.minAmount.toString() : ''
  );
  const [maxAmount, setMaxAmount] = useState(
    filters.maxAmount ? filters.maxAmount.toString() : ''
  );

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams(searchParamsHook);

    // Search term
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }

    // Date range
    if (dateFrom) {
      params.set('dateFrom', dateFrom);
    } else {
      params.delete('dateFrom');
    }

    if (dateTo) {
      params.set('dateTo', dateTo);
    } else {
      params.delete('dateTo');
    }

    // Payment method
    if (paymentMethodId) {
      params.set('paymentMethodId', paymentMethodId);
    } else {
      params.delete('paymentMethodId');
    }

    // Commission status
    if (commissionStatus !== 'ALL') {
      params.set('commissionStatus', commissionStatus);
    } else {
      params.delete('commissionStatus');
    }

    // Amount range
    if (minAmount) {
      params.set('minAmount', minAmount);
    } else {
      params.delete('minAmount');
    }

    if (maxAmount) {
      params.set('maxAmount', maxAmount);
    } else {
      params.delete('maxAmount');
    }

    // Reset to page 1
    params.set('page', '1');

    // Update URL
    router.push(`?${params.toString()}`);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setPaymentMethodId('');
    setCommissionStatus('ALL');
    setMinAmount('');
    setMaxAmount('');
    router.push(`/dashboard/branch-admin/${spaId}/${branchId}/payments`);
  };

  // Handle view payment
  const handleViewPayment = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsDetailModalOpen(true);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParamsHook);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  // Check if there are active filters
  const hasActiveFilters =
    !!searchTerm ||
    !!dateFrom ||
    !!dateTo ||
    !!paymentMethodId ||
    commissionStatus !== 'ALL' ||
    !!minAmount ||
    !!maxAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Pagos y Finanzas
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {branch.spa.name} - {branch.name}
        </p>
      </div>

      {/* Stats Cards (Always visible) */}
      <PaymentStatsCards stats={stats} />

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex flex-wrap gap-2 sm:gap-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('payments')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
          >
            💰 Pagos
          </button>
          <button
            onClick={() => setActiveTab('methods')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === 'methods'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
          >
            💳 Métodos (Clientes)
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === 'accounts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
          >
            🏦 Cuentas del Spa
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === 'commissions'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
          >
            📊 Comisiones
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === 'trends'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }
            `}
          >
            📈 Tendencias
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'payments' && (
        <>
          {/* Export Section */}
          <PaymentExport
            payments={payments}
            filters={filters}
            spaId={spaId}
            branchId={branchId}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            branchName={branch.name}
            spaName={branch.spa.name}
          />

          {/* Payment Methods Summary */}
          {stats.byPaymentMethod.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {stats.byPaymentMethod.map(method => (
                    <div
                      key={method.methodId}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {method.methodName}
                      </p>
                      <p className="text-xl font-bold mt-1">
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          minimumFractionDigits: 0,
                        }).format(method.amount)}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>{method.count} pagos</span>
                        <span className="font-semibold">
                          {method.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${method.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Buscar y Filtrar Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por cliente, documento o referencia..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter') handleSearch();
                      }}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Date From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Desde
                    </label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={e => setDateFrom(e.target.value)}
                    />
                  </div>

                  {/* Date To */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hasta
                    </label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={e => setDateTo(e.target.value)}
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Método de Pago
                    </label>
                    <Select
                      value={paymentMethodId}
                      onChange={e => setPaymentMethodId(e.target.value)}
                    >
                      <option value="">Todos los métodos</option>
                      {paymentMethods.map(method => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Commission Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estado Comisión
                    </label>
                    <Select
                      value={commissionStatus}
                      onChange={e => setCommissionStatus(e.target.value)}
                    >
                      <option value="ALL">Todos los estados</option>
                      <option value="PENDING">Pendiente</option>
                      <option value="PAID">Pagada</option>
                      <option value="CANCELLED">Cancelada</option>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Buscar
                  </Button>
                  {hasActiveFilters && (
                    <Button
                      onClick={handleClearFilters}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      Limpiar Filtros
                    </Button>
                  )}
                </div>

                {/* Advanced Filters */}
                <PaymentFiltersAdvanced
                  minAmount={minAmount}
                  maxAmount={maxAmount}
                  onMinAmountChange={setMinAmount}
                  onMaxAmountChange={setMaxAmount}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No hay pagos registrados
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {hasActiveFilters
                      ? 'No se encontraron pagos con los filtros aplicados'
                      : 'Los pagos aparecerán aquí cuando se registren citas'}
                  </p>
                </div>
              ) : (
                <>
                  <PaymentTable
                    payments={payments}
                    onView={handleViewPayment}
                  />

                  {/* Pagination */}
                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    itemName="pagos"
                  />
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'methods' && (
        <PaymentMethodsManager paymentMethods={paymentMethods} spaId={spaId} />
      )}

      {activeTab === 'accounts' && (
        <SpaAccountsManager
          spaAccounts={spaAccounts}
          spaId={spaId}
          branches={branches}
        />
      )}

      {activeTab === 'commissions' && (
        <CommissionDashboard
          payments={payments}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
        />
      )}

      {activeTab === 'trends' && <PaymentTrends stats={stats} />}

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPaymentId(null);
        }}
        paymentId={selectedPaymentId}
        spaId={spaId}
        branchId={branchId}
      />
    </div>
  );
}
