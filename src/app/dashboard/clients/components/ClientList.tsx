import { Client } from '../types'
import { ClientItem } from './ClientItem'
import { EmptyState } from '@/components/ui/EmptyState'

interface ClientListProps {
  clients: Client[]
  filters: {
    search?: string
    status?: 'ACTIVE' | 'INACTIVE'
  }
}

export function ClientList({ clients, filters }: ClientListProps) {
  // Filtrar clientes basado en los filtros
  const filteredClients = clients.filter(client => {
    const matchesSearch = !filters.search ||
      client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      client.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      client.phone.includes(filters.search)

    const matchesStatus = !filters.status || client.status === filters.status

    return matchesSearch && matchesStatus
  })

  if (filteredClients.length === 0) {
    return (
      <EmptyState
        title="No se encontraron clientes"
        description="Intenta ajustar los filtros de búsqueda"
        icon="👥"
      />
    )
  }

  return (
    <div className="space-y-3">
      {filteredClients.map(client => (
        <ClientItem key={client.id} client={client} />
      ))}
    </div>
  )
}


