import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ClientFilters } from '../types';

interface ClientFiltersProps {
  filters: ClientFilters;
  onFiltersChange: (filters: ClientFilters) => void;
  resultsCount: number;
}

export function ClientFilters({
  filters,
  onFiltersChange,
  resultsCount,
}: ClientFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter(
    value => value !== '' && value !== undefined
  ).length;
  const hasActiveFilters = activeFiltersCount > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4'>
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4'>
        <div className='flex items-center space-x-3 mb-3 sm:mb-0'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white'>
            Filtros
          </h2>
          {hasActiveFilters && (
            <div className='flex items-center space-x-2'>
              <Badge variant='primary'>
                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''}{' '}
                activo
                {activeFiltersCount !== 1 ? 's' : ''}
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
          {resultsCount} cliente{resultsCount !== 1 ? 's' : ''} encontrado
          {resultsCount !== 1 ? 's' : ''}
        </span>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
        <Input
          name='search'
          type='text'
          placeholder='Buscar por nombre, email...'
          value={filters.search || ''}
          onChange={handleInputChange}
          active={!!filters.search}
          label='Buscar'
        />
        <Select
          name='status'
          value={filters.status || ''}
          onChange={handleSelectChange}
          active={!!filters.status}
          label='Estado'
        >
          <option value=''>Todos los estados</option>
          <option value='ACTIVE'>Activo</option>
          <option value='INACTIVE'>Inactivo</option>
        </Select>
      </div>
    </div>
  );
}
