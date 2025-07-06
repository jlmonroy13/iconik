import { Service } from '../types'
import { Badge, Button } from '@/components/ui'
import { Pencil, Trash2 } from 'lucide-react'

interface ServiceItemProps {
  service: Service
  onEdit?: () => void
  onDelete?: () => void
}

export function ServiceItem({ service, onEdit, onDelete }: ServiceItemProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 flex items-start justify-between">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {service.name}
        </h3>
        {service.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {service.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant={service.isActive ? 'success' : 'secondary'}>
            {service.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
          <Badge variant="primary">{service.duration} min</Badge>
          {typeof service.recommendedReturnDays === 'number' && service.recommendedReturnDays > 0 && (
            <Badge variant="outline">Recom: {service.recommendedReturnDays} días</Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 min-w-[120px]">
        <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
          ${service.price.toLocaleString('es-CO')}
        </span>
        <div className="flex gap-2 mt-2">
          {onEdit && (
            <Button size="sm" variant="ghost" onClick={onEdit}>
              <Pencil className="w-4 h-4 mr-1" /> Editar
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="ghost" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-1" /> Eliminar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
