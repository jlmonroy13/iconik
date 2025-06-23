import { Button, Badge, Input, Select } from '@/components/ui'
import { ServiceFilters } from '../types'

interface ServiceFiltersProps {
  filters: ServiceFilters
  onFiltersChange: (filters: ServiceFilters) => void
  uniqueManicurists: string[]
  resultsCount: number
}

export function ServiceFiltersPanel({
  filters,
  onFiltersChange,
  uniqueManicurists,
  resultsCount
}: ServiceFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length
  const hasActiveFilters = activeFiltersCount > 0

  const clearFilters = () => {
    onFiltersChange({ serviceType: '', manicurist: '', dateFrom: '', dateTo: '' })
  }

  const updateFilter = (key: keyof ServiceFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Filtros
          </h2>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <Badge variant="primary">
                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}
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
          {resultsCount} servicios encontrados
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <Select
            value={filters.serviceType}
            onChange={e => updateFilter('serviceType', e.target.value)}
            active={!!filters.serviceType}
            label="Tipo de Servicio"
            labelAdornment={filters.serviceType && (<span className="ml-1 text-pink-600 dark:text-pink-400">●</span>)}
          >
            <option value="">Todos los tipos</option>
            <option value="MANICURE">Manicure</option>
            <option value="PEDICURE">Pedicure</option>
            <option value="NAIL_ART">Nail Art</option>
            <option value="GEL_POLISH">Esmalte en Gel</option>
            <option value="ACRYLIC_NAILS">Uñas Acrílicas</option>
          </Select>
        </div>

        <div>
          <Select
            value={filters.manicurist}
            onChange={e => updateFilter('manicurist', e.target.value)}
            active={!!filters.manicurist}
            label="Manicurista"
            labelAdornment={filters.manicurist && (<span className="ml-1 text-pink-600 dark:text-pink-400">●</span>)}
          >
            <option value="">Todas las manicuristas</option>
            {uniqueManicurists.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </Select>
        </div>

        <div>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={e => updateFilter('dateFrom', e.target.value)}
            active={!!filters.dateFrom}
            label="Fecha Desde"
            labelAdornment={filters.dateFrom && (<span className="ml-1 text-pink-600 dark:text-pink-400">●</span>)}
          />
        </div>

        <div>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={e => updateFilter('dateTo', e.target.value)}
            active={!!filters.dateTo}
            label="Fecha Hasta"
            labelAdornment={filters.dateTo && (<span className="ml-1 text-pink-600 dark:text-pink-400">●</span>)}
          />
        </div>
      </div>
    </div>
  )
}
