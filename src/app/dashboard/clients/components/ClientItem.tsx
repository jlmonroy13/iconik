import { Client } from '../types'
import { Badge } from '@/components/ui/Badge'
import { format } from 'date-fns'

interface ClientItemProps {
  client: Client
}

export function ClientItem({ client }: ClientItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 mb-3 shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-semibold text-gray-900 dark:text-white text-base truncate">{client.name}</span>
          <Badge variant={client.status === 'ACTIVE' ? 'success' : 'secondary'}>
            {client.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{client.email}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{client.phone}</div>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Registrado el {format(new Date(client.registeredAt), 'dd MMMM yyyy')}
        </div>
      </div>
      <div className="flex flex-col sm:items-end mt-2 sm:mt-0 sm:ml-6">
        <div className="text-sm text-gray-900 dark:text-white font-bold">
          {client.visits} visita{client.visits !== 1 ? 's' : ''}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Total gastado: <span className="font-semibold text-pink-600 dark:text-pink-400">${client.totalSpent.toLocaleString('es-CO')}</span>
        </div>
      </div>
    </div>
  )
}

