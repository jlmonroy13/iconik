import { ManicuristFilters as ManicuristFiltersType, ServiceType } from '../types'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge, Button } from '@/components/ui'

interface ManicuristFiltersProps {
  filters: ManicuristFiltersType
  onFiltersChange: (filters: ManicuristFiltersType) => void
}

export function ManicuristFilters({ filters, onFiltersChange }: ManicuristFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, status: e.target.value as 'ACTIVE' | 'INACTIVE' })
  }

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, specialty: e.target.value as ServiceType })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length
  const hasActiveFilters = activeFiltersCount > 0

  return (
    <div>
      <div
        className="flex items-center space-x-2 mb-4"
        style={{ minHeight: hasActiveFilters ? 36 : 8 }}
      >
        {hasActiveFilters ? (
          <>
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
          </>
        ) : (
          <div style={{ height: 0 }} />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <Input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            active={!!filters.search}
            label="Buscar"
            labelAdornment={filters.search && (<span className="ml-1 text-pink-600 dark:text-pink-400">●</span>)}
          />
        </div>
        <div>
          <Select
            value={filters.status || ''}
            onChange={handleStatusChange}
            active={!!filters.status}
            label="Estado"
            labelAdornment={filters.status && (<span className="ml-1 text-pink-600 dark:text-pink-400">●</span>)}
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVE">Activos</option>
            <option value="INACTIVE">Inactivos</option>
          </Select>
        </div>
        <div>
          <Select
            value={filters.specialty || ''}
            onChange={handleSpecialtyChange}
            active={!!filters.specialty}
            label="Especialidad"
            labelAdornment={filters.specialty && (<span className="ml-1 text-pink-600 dark:text-pink-400">●</span>)}
          >
            <option value="">Todas las especialidades</option>
            <option value="MANICURE">💅 Manicure</option>
            <option value="PEDICURE">🦶 Pedicure</option>
            <option value="NAIL_ART">🎨 Nail Art</option>
            <option value="GEL_POLISH">✨ Esmalte en Gel</option>
            <option value="ACRYLIC_NAILS">💎 Uñas Acrílicas</option>
          </Select>
        </div>
      </div>
    </div>
  )
}
