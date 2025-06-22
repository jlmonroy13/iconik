import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { ClientFilters } from '../types'

interface ClientFiltersProps {
  filters: ClientFilters
  onFiltersChange: (filters: ClientFilters) => void
}

export function ClientFilters({ filters, onFiltersChange }: ClientFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, status: e.target.value as 'ACTIVE' | 'INACTIVE' })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      <Input
        type="text"
        placeholder="Buscar por nombre, email o teléfono..."
        value={filters.search || ''}
        onChange={handleSearchChange}
        active={!!filters.search}
        label="Buscar"
        labelAdornment={filters.search && (<span className="ml-1 text-pink-600 dark:text-pink-400">●</span>)}
      />
      <Select
        value={filters.status || ''}
        onChange={handleStatusChange}
        active={!!filters.status}
        label="Estado"
        labelAdornment={filters.status && (<span className="ml-1 text-pink-600 dark:text-pink-400">●</span>)}
      >
        <option value="">Todos los estados</option>
        <option value="ACTIVE">Activo</option>
        <option value="INACTIVE">Inactivo</option>
      </Select>
    </div>
  )
}
