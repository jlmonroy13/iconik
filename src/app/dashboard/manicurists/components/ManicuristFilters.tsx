import { ManicuristFilters as ManicuristFiltersType } from '../types'
import { Input } from '@/components/ui/Input'
import { Badge, Button, Select } from '@/components/ui'

interface ManicuristFiltersProps {
  filters: ManicuristFiltersType
  onFiltersChange: (filters: ManicuristFiltersType) => void
  resultsCount: number
}

export function ManicuristFilters({
  filters,
  onFiltersChange,
  resultsCount,
}: ManicuristFiltersProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, [e.target.name]: e.target.value })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const activeFiltersCount = Object.values(filters).filter(
    (value) => !!value
  ).length
  const hasActiveFilters = activeFiltersCount > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Filtros
          </h2>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <Badge variant="primary">
                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo
                {activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
              <Button
                onClick={clearFilters}
                variant="link"
                size="sm"
                className="text-xs p-0 h-auto"
              >
                Limpiar
              </Button>
            </div>
          )}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {resultsCount} manicurista{resultsCount !== 1 ? 's' : ''} encontrada
          {resultsCount !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Input
          name="search"
          type="text"
          placeholder="Buscar por nombre, email..."
          value={filters.search || ''}
          onChange={handleInputChange}
          active={!!filters.search}
          label="Buscar"
        />
        <Select
          name="isActive"
          value={filters.isActive?.toString() || ''}
          onChange={(e) => {
            const value = e.target.value
            onFiltersChange({
              ...filters,
              isActive: value === '' ? undefined : value === 'true'
            })
          }}
          active={filters.isActive !== undefined}
          label="Estado"
        >
          <option value="">Todos</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </Select>
      </div>
    </div>
  )
}
