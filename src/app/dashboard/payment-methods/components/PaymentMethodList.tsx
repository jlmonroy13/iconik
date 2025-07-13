import type { PaymentMethod } from '../types'
import { EmptyState } from './EmptyState'
import { ItemActions } from '@/components/ui/ItemActions'

interface PaymentMethodListProps {
  methods: PaymentMethod[]
  onEdit?: (method: PaymentMethod) => void
  onDelete?: (method: PaymentMethod) => void
}

function formatFee(fee: number) {
  return `${(fee * 100).toFixed(1)}%`
}

export function PaymentMethodList({ methods, onEdit, onDelete }: PaymentMethodListProps) {
  if (!methods || methods.length === 0) {
    return <EmptyState />
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      {methods.map((method) => (
        <div
          key={method.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700"
        >
          <div>
            <span className="font-medium text-gray-900 dark:text-white">{method.name}</span>
            {method.type && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{method.type}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${method.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {method.isActive ? 'Activo' : 'Inactivo'}
            </span>
            <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/40">
              {formatFee(method.transactionFee)}
            </span>
            <ItemActions
              onEdit={onEdit ? () => onEdit(method) : undefined}
              onDelete={onDelete ? () => onDelete(method) : undefined}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
