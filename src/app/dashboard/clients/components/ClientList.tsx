import { Client } from '../types'
import { ClientItem } from './ClientItem'

interface ClientListProps {
  clients: Client[]
  filters: { // This is likely passed for other reasons, but we only need clients now
    search?: string
    status?: 'ACTIVE' | 'INACTIVE'
  }
}

export function ClientList({ clients }: ClientListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {clients.map(client => (
        <ClientItem key={client.id} client={client} />
      ))}
    </div>
  )
}


