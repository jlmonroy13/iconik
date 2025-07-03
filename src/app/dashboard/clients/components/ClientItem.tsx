import { Client } from '../types'
import { Avatar, ItemActions } from '@/components/ui'

interface ClientItemProps {
  client: Client
  onEdit?: () => void
  onDelete?: () => void
}

export function ClientItem({ client, onEdit, onDelete }: ClientItemProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
      <div className="flex items-start justify-between space-x-4">
        <div className="flex items-center space-x-3">
           <Avatar
            fallback={client.name.charAt(0)}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">{client.name}</span>
            </div>
            {client.email && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{client.email}</p>
            )}
            {client.phone && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{client.phone}</p>
            )}
            {client.notes && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{client.notes}</p>
            )}
          </div>
        </div>
        <ItemActions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  )
}

