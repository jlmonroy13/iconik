'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui';
import { ExpenseStatsCards } from './ExpenseStats';
import { ExpenseTable } from './ExpenseTable';
import { ExpenseModal } from './ExpenseModal';
import { ExpensePaymentModal } from './ExpensePaymentModal';
import type {
  ExpenseListItem,
  ExpenseStats,
  ExpenseFilters,
} from '@/types/expenses';
import type { SpaAccountDropdown } from '@/types/spaAccounts';
import {
  EXPENSE_TYPE_LABELS,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_FREQUENCY_LABELS,
} from '@/types/expenses';

interface ExpensesClientProps {
  expenses: ExpenseListItem[];
  stats: ExpenseStats;
  spaAccounts: SpaAccountDropdown[];
  spaId: string;
  branchId: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  filters: ExpenseFilters;
}

export function ExpensesClient({
  expenses,
  stats,
  spaAccounts,
  spaId,
  branchId,
  pagination,
  filters,
}: ExpensesClientProps) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseListItem | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [typeFilter, setTypeFilter] = useState<string>(filters.type || 'ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>(
    filters.category || 'ALL'
  );
  const [frequencyFilter, setFrequencyFilter] = useState<string>(
    filters.frequency || 'ALL'
  );
  const [isPaidFilter, setIsPaidFilter] = useState<string>(
    filters.isPaid === true
      ? 'true'
      : filters.isPaid === false
        ? 'false'
        : 'ALL'
  );
  const [dateFrom, setDateFrom] = useState(
    filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''
  );
  const [dateTo, setDateTo] = useState(
    filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''
  );

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams(searchParamsHook);

    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }

    if (typeFilter !== 'ALL') {
      params.set('type', typeFilter);
    } else {
      params.delete('type');
    }

    if (categoryFilter !== 'ALL') {
      params.set('category', categoryFilter);
    } else {
      params.delete('category');
    }

    if (frequencyFilter !== 'ALL') {
      params.set('frequency', frequencyFilter);
    } else {
      params.delete('frequency');
    }

    if (isPaidFilter !== 'ALL') {
      params.set('isPaid', isPaidFilter);
    } else {
      params.delete('isPaid');
    }

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

    params.set('page', '1');

    router.push(`?${params.toString()}`);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setCategoryFilter('ALL');
    setFrequencyFilter('ALL');
    setIsPaidFilter('ALL');
    setDateFrom('');
    setDateTo('');
    router.push(`/dashboard/branch-admin/${spaId}/${branchId}/expenses`);
  };

  // Handle pay expense
  const handlePayExpense = (expense: ExpenseListItem) => {
    setSelectedExpense(expense);
    setIsPaymentModalOpen(true);
  };

  // Handle edit expense
  const handleEditExpense = (expense: ExpenseListItem) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
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
    typeFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    frequencyFilter !== 'ALL' ||
    isPaidFilter !== 'ALL' ||
    !!dateFrom ||
    !!dateTo;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Gastos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Administra los gastos del negocio
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          + Nuevo Gasto
        </Button>
      </div>

      {/* Stats Cards and Overdue Expenses - Two Column Layout - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* First Column: Stats Cards */}
        <div>
          <ExpenseStatsCards stats={stats} />
        </div>

        {/* Second Column: Overdue Expenses */}
        {stats.overdue.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">⚠️ Gastos Vencidos</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {stats.overdue.map((expense, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {expense.name}
                      </p>
                      <p className="text-xs text-red-600">
                        Vencido hace {expense.daysOverdue} días
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-red-600">
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          minimumFractionDigits: 0,
                        }).format(expense.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Expenses - Full Width Below - Compact */}
      {stats.upcoming.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              📅 Próximos Vencimientos (30 días)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-2">
              {stats.upcoming.map((expense, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {expense.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(expense.dueDate).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-blue-600">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                      }).format(expense.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters - Compact */}
      <Card>
        <CardContent className="p-3">
          <div className="space-y-2">
            {/* Search and Filters Row */}
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className="flex-1 min-w-[200px] text-sm py-1.5"
              />

              <div className="min-w-[140px]">
                <Select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="text-sm"
                >
                  <option value="ALL">Todos los tipos</option>
                  {Object.entries(EXPENSE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="min-w-[160px]">
                <Select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="text-sm"
                >
                  <option value="ALL">Todas las categorías</option>
                  {Object.entries(EXPENSE_CATEGORY_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </Select>
              </div>

              <div className="min-w-[150px]">
                <Select
                  value={frequencyFilter}
                  onChange={e => setFrequencyFilter(e.target.value)}
                  className="text-sm"
                >
                  <option value="ALL">Todas las frecuencias</option>
                  {Object.entries(EXPENSE_FREQUENCY_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </Select>
              </div>

              <div className="min-w-[140px]">
                <Select
                  value={isPaidFilter}
                  onChange={e => setIsPaidFilter(e.target.value)}
                  className="text-sm"
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="false">Pendiente</option>
                  <option value="true">Pagado</option>
                </Select>
              </div>

              <div className="flex gap-1.5">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  placeholder="Desde"
                  className="w-[130px] text-sm py-1.5"
                />
                <Input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  placeholder="Hasta"
                  className="w-[130px] text-sm py-1.5"
                />
              </div>

              <div className="flex gap-1.5">
                <Button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1.5 h-auto"
                >
                  Buscar
                </Button>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    className="bg-gray-600 hover:bg-gray-700 text-sm px-3 py-1.5 h-auto"
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💸</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay gastos registrados
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {hasActiveFilters
                  ? 'No se encontraron gastos con los filtros aplicados'
                  : 'Comienza creando tu primer gasto'}
              </p>
              {!hasActiveFilters && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Crear Primer Gasto
                </Button>
              )}
            </div>
          ) : (
            <>
              <ExpenseTable
                expenses={expenses}
                onPay={handlePayExpense}
                onEdit={handleEditExpense}
              />

              {/* Pagination */}
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                itemName="gastos"
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <ExpenseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        spaId={spaId}
        mode="create"
      />

      {/* Edit Modal */}
      <ExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExpense(null);
        }}
        spaId={spaId}
        mode="edit"
        expense={selectedExpense}
      />

      {/* Payment Modal */}
      {selectedExpense && (
        <ExpensePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedExpense(null);
          }}
          spaId={spaId}
          expense={selectedExpense}
          spaAccounts={spaAccounts}
        />
      )}
    </div>
  );
}
