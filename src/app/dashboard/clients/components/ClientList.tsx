import { Client } from '../types'
import { ClientItem } from './ClientItem'

interface ClientListProps {
  clients: Client[]
  filters: { // This is likely passed for other reasons, but we only need clients now
    search?: string
    status?: 'ACTIVE' | 'INACTIVE'
  }
  onEdit?: (client: Client) => void
  onDelete?: (client: Client) => void
}

export function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {clients.map(client => (
        <ClientItem
          key={client.id}
          client={client}
          onEdit={onEdit ? () => onEdit(client) : undefined}
          onDelete={onDelete ? () => onDelete(client) : undefined}
        />
      ))}
    </div>
  )
}


