import { Client } from '../types'
import { Badge, Avatar } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

interface ClientItemProps {
  client: Client
}

export function ClientItem({ client }: ClientItemProps) {
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
              <Badge variant={client.status === 'ACTIVE' ? 'success' : 'secondary'}>
                {client.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{client.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <div className="text-sm text-gray-900 dark:text-white font-bold">
            {client.visits} visita{client.visits !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total gastado: <span className="font-semibold text-pink-600 dark:text-pink-400">{formatCurrency(client.totalSpent)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

