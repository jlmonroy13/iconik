'use client';

import { useState } from 'react';
import { Input, Select } from '@/components/ui';

export function AppointmentFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    serviceType: '',
    manicurist: '',
    dateFrom: '',
    dateTo: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      serviceType: '',
      manicurist: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className='relative'>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm ${
          hasActiveFilters
            ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        <span className='flex items-center gap-2'>
          <span className='text-base'>🔍</span>
          <span className='hidden sm:inline'>Filtros</span>
          {hasActiveFilters && (
            <span className='w-2 h-2 bg-blue-600 rounded-full'></span>
          )}
        </span>
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className='absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10'>
          <div className='p-4 space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
                Filtros de Citas
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className='text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Status Filter */}
            <Select
              label='Estado'
              value={filters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
            >
              <option value=''>Todos los estados</option>
              <option value='SCHEDULED'>Programada</option>
              <option value='CONFIRMED'>Confirmada</option>
              <option value='IN_PROGRESS'>En Progreso</option>
              <option value='COMPLETED'>Completada</option>
              <option value='CANCELLED'>Cancelada</option>
              <option value='NO_SHOW'>No Asistió</option>
            </Select>

            {/* Service Type Filter */}
            <Select
              label='Tipo de Servicio'
              value={filters.serviceType}
              onChange={e => handleFilterChange('serviceType', e.target.value)}
            >
              <option value=''>Todos los servicios</option>
              <option value='MANICURE'>Manicure</option>
              <option value='PEDICURE'>Pedicure</option>
              <option value='NAIL_ART'>Nail Art</option>
              <option value='GEL_POLISH'>Gel Polish</option>
              <option value='ACRYLIC_NAILS'>Uñas Acrílicas</option>
              <option value='NAIL_REPAIR'>Reparación</option>
              <option value='HAND_SPA'>Spa de Manos</option>
              <option value='FOOT_SPA'>Spa de Pies</option>
              <option value='OTHER'>Otro</option>
            </Select>

            {/* Date Range Filters */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
              <Input
                label='Desde'
                type='date'
                value={filters.dateFrom}
                onChange={e => handleFilterChange('dateFrom', e.target.value)}
              />
              <Input
                label='Hasta'
                type='date'
                value={filters.dateTo}
                onChange={e => handleFilterChange('dateTo', e.target.value)}
              />
            </div>

            {/* Quick Date Filters */}
            <div className='grid grid-cols-2 gap-2'>
              <button
                onClick={() => {
                  const today = new Date();
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  handleFilterChange(
                    'dateFrom',
                    today.toISOString().split('T')[0]
                  );
                  handleFilterChange(
                    'dateTo',
                    tomorrow.toISOString().split('T')[0]
                  );
                }}
                className='px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
              >
                Hoy
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const nextWeek = new Date(today);
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  handleFilterChange(
                    'dateFrom',
                    today.toISOString().split('T')[0]
                  );
                  handleFilterChange(
                    'dateTo',
                    nextWeek.toISOString().split('T')[0]
                  );
                }}
                className='px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
              >
                Próxima Semana
              </button>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setIsOpen(false)}
              className='w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors'
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className='fixed inset-0 z-0' onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
