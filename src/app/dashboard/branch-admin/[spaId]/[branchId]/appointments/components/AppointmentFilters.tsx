'use client';

import { useState } from 'react';
import {
  Input,
  Select,
  Button,
  SearchSelect,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import type {
  AppointmentFilters as FilterType,
  QuickDateFilter,
  AppointmentFormDropdownData,
} from '@/types';
import {
  getDateRangeFromQuickFilter,
  getQuickFilterFromDateRange,
} from '../queries';
import { format } from 'date-fns';
import { useEffect } from 'react';

interface AppointmentFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  formData: AppointmentFormDropdownData;
  onClearCalendarSelection?: () => void;
}

export function AppointmentFilters({
  filters,
  onFiltersChange,
  formData,
  onClearCalendarSelection,
}: AppointmentFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [quickFilter, setQuickFilter] = useState<QuickDateFilter>('custom');

  // Sync quickFilter when filters.dateFrom/dateTo change externally (e.g., from calendar)
  useEffect(() => {
    const detectedFilter = getQuickFilterFromDateRange(
      filters.dateFrom,
      filters.dateTo
    );
    setQuickFilter(detectedFilter);
  }, [filters.dateFrom, filters.dateTo]);

  // Quick date filter options
  const quickDateFilters: Array<{ value: QuickDateFilter; label: string }> = [
    { value: 'today', label: 'Hoy' },
    { value: 'tomorrow', label: 'Mañana' },
    { value: 'this-week', label: 'Esta Semana' },
    { value: 'next-week', label: 'Próxima Semana' },
    { value: 'this-month', label: 'Este Mes' },
    { value: 'custom', label: 'Personalizado' },
  ];

  // Status options
  const statusOptions = [
    { value: 'ALL', label: 'Todos los Estados' },
    { value: 'SCHEDULED', label: 'Agendadas' },
    { value: 'IN_PROGRESS', label: 'En Progreso' },
    { value: 'COMPLETED', label: 'Completadas' },
    { value: 'PENDING_APPROVAL', label: 'Pendientes' },
    { value: 'CANCELLED', label: 'Canceladas' },
    { value: 'NO_SHOW', label: 'No Asistió' },
  ];

  // Handle quick date filter change
  const handleQuickFilterChange = (filter: QuickDateFilter) => {
    setQuickFilter(filter);

    // Clear calendar selection when a quick filter is selected
    if (onClearCalendarSelection) {
      onClearCalendarSelection();
    }

    if (filter === 'custom') {
      // Clear date filters for custom
      onFiltersChange({
        ...filters,
        dateFrom: undefined,
        dateTo: undefined,
      });
      // Automatically show advanced filters when custom is selected
      setShowAdvanced(true);
    } else {
      // Apply quick filter dates
      const dateRange = getDateRangeFromQuickFilter(filter);
      if (dateRange) {
        onFiltersChange({
          ...filters,
          dateFrom: dateRange.dateFrom,
          dateTo: dateRange.dateTo,
        });
      }
    }
  };

  // Handle custom date range
  const handleCustomDateChange = (type: 'from' | 'to', value: string) => {
    setQuickFilter('custom');
    const date = value ? new Date(value) : undefined;

    onFiltersChange({
      ...filters,
      [type === 'from' ? 'dateFrom' : 'dateTo']: date,
    });
  };

  // Handle search
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
    });
  };

  // Handle status change
  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value as FilterType['status'],
    });
  };

  // Handle manicurist filter
  const handleManicuristChange = (value: string) => {
    onFiltersChange({
      ...filters,
      manicuristId: value || undefined,
    });
  };

  // Handle client filter
  const handleClientChange = (value: string) => {
    onFiltersChange({
      ...filters,
      clientId: value || undefined,
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setQuickFilter('custom');
    onFiltersChange({
      status: 'ALL',
      manicuristId: undefined,
      clientId: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      search: undefined,
    });
  };

  // Count active filters
  const activeFilterCount = [
    filters.status && filters.status !== 'ALL',
    filters.manicuristId,
    filters.clientId,
    filters.dateFrom,
    filters.dateTo,
    filters.search,
  ].filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar por nombre, teléfono o documento..."
              value={filters.search || ''}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Ocultar' : 'Filtros Avanzados'}
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-medium">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Quick Date Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Fecha:
          </span>
          {quickDateFilters.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleQuickFilterChange(option.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                quickFilter === option.value
                  ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Custom Date Range (shown when "Personalizado" is selected) */}
        {quickFilter === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Input
              label="Fecha Desde"
              type="date"
              value={
                filters.dateFrom ? format(filters.dateFrom, 'yyyy-MM-dd') : ''
              }
              onChange={e => handleCustomDateChange('from', e.target.value)}
            />
            <Input
              label="Fecha Hasta"
              type="date"
              value={filters.dateTo ? format(filters.dateTo, 'yyyy-MM-dd') : ''}
              onChange={e => handleCustomDateChange('to', e.target.value)}
            />
          </div>
        )}

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <Select
                label="Estado"
                value={filters.status || 'ALL'}
                onChange={e => handleStatusChange(e.target.value)}
                options={statusOptions}
              />

              {/* Manicurist Filter */}
              <SearchSelect
                label="Manicurista"
                placeholder="Todas las manicuristas"
                options={[
                  { value: '', label: 'Todas las manicuristas' },
                  ...formData.manicurists.map(m => ({
                    value: m.id,
                    label: m.name,
                  })),
                ]}
                value={filters.manicuristId || ''}
                onChange={handleManicuristChange}
              />

              {/* Client Filter */}
              <SearchSelect
                label="Cliente"
                placeholder="Todos los clientes"
                options={[
                  { value: '', label: 'Todos los clientes' },
                  ...formData.clients.map(c => ({
                    value: c.id,
                    label: `${c.name} - ${c.phone}`,
                    searchText: `${c.name} ${c.phone} ${c.email || ''}`,
                  })),
                ]}
                value={filters.clientId || ''}
                onChange={handleClientChange}
              />

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClearFilters}
                  className="w-full"
                  disabled={activeFilterCount === 0}
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Filtros activos:</span>
            {filters.status && filters.status !== 'ALL' && (
              <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                {statusOptions.find(s => s.value === filters.status)?.label}
              </span>
            )}
            {filters.manicuristId && (
              <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                Manicurista:{' '}
                {
                  formData.manicurists.find(m => m.id === filters.manicuristId)
                    ?.name
                }
              </span>
            )}
            {filters.clientId && (
              <span className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded">
                Cliente:{' '}
                {formData.clients.find(c => c.id === filters.clientId)?.name}
              </span>
            )}
            {filters.dateFrom && (
              <span className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 rounded">
                Desde: {format(filters.dateFrom, 'dd/MM/yyyy')}
              </span>
            )}
            {filters.dateTo && (
              <span className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 rounded">
                Hasta: {format(filters.dateTo, 'dd/MM/yyyy')}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
