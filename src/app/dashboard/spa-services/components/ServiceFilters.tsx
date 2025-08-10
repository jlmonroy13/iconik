import { Button, Badge, Input, Select } from '@/components/ui';
import { ServiceFilters } from '../types';

interface ServiceFiltersProps {
  filters: ServiceFilters;
  onFiltersChange: (filters: ServiceFilters) => void;
  resultsCount: number;
}

export function ServiceFiltersPanel({
  filters,
  onFiltersChange,
  resultsCount,
}: ServiceFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter(
    value => value !== '' && value !== undefined
  ).length;
  const hasActiveFilters = activeFiltersCount > 0;

  const clearFilters = () => {
    onFiltersChange({ type: undefined, isActive: undefined, search: '' });
  };

  const updateFilter = (
    key: keyof ServiceFilters,
    value: string | boolean | undefined
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 relative'>
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center space-x-3'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white'>
            Filtros
          </h2>
          {hasActiveFilters && (
            <div className='flex items-center space-x-2'>
              <Badge variant='primary'>
                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''}{' '}
                activo{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
              <Button
                onClick={clearFilters}
                variant='link'
                size='sm'
                className='text-xs p-0 h-auto'
              >
                Limpiar
              </Button>
            </div>
          )}
        </div>
        <span className='text-sm text-gray-500 dark:text-gray-400'>
          {resultsCount} servicios encontrados
        </span>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3'>
        <div>
          <Input
            type='text'
            value={filters.search || ''}
            onChange={e => updateFilter('search', e.target.value)}
            active={!!filters.search}
            label='Buscar servicios'
            placeholder='Buscar por nombre...'
            labelAdornment={
              filters.search && (
                <span className='ml-1 text-pink-600 dark:text-pink-400'>●</span>
              )
            }
          />
        </div>
        <div>
          <Select
            value={
              filters.isActive === undefined
                ? ''
                : filters.isActive
                  ? 'true'
                  : 'false'
            }
            onChange={e =>
              updateFilter(
                'isActive',
                e.target.value === '' ? undefined : e.target.value === 'true'
              )
            }
            active={filters.isActive !== undefined}
            label='Estado'
            labelAdornment={
              filters.isActive !== undefined && (
                <span className='ml-1 text-pink-600 dark:text-pink-400'>●</span>
              )
            }
          >
            <option value=''>Todos los estados</option>
            <option value='true'>Activo</option>
            <option value='false'>Inactivo</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
