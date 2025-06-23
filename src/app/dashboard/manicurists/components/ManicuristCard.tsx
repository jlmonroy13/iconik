import { Avatar, Badge } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { Pencil } from 'lucide-react'
import type { Manicurist } from '../types'

interface ManicuristCardProps {
  manicurist: Manicurist
  onEdit?: () => void
}

export function ManicuristCard({ manicurist, onEdit }: ManicuristCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-start gap-4">
        {/* Avatar and basic info */}
        <div className="flex items-center gap-4">
          <Avatar
            src={manicurist.avatar}
            alt={manicurist.name}
            fallback={manicurist.name.charAt(0)}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {manicurist.name}
              </h3>
              <Badge variant={manicurist.status === 'ACTIVE' ? 'success' : 'secondary'}>
                {manicurist.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {manicurist.email}
            </p>
          </div>
        </div>

        {/* Edit button */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="ml-auto p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Total Servicios
          </p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {manicurist.totalServices}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Total Ingresos
          </p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(manicurist.totalRevenue)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Servicios (Mes)
          </p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {manicurist.thisMonthServices}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Ingresos (Mes)
          </p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(manicurist.thisMonthRevenue)}
          </p>
        </div>
      </div>

      {/* Specialties */}
      <div className="mt-3">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Especialidades
        </p>
        <div className="flex flex-wrap gap-1">
          {manicurist.specialties.map(specialty => (
            <Badge key={specialty} variant="outline">
              {specialty === 'MANICURE' && 'Manicure'}
              {specialty === 'PEDICURE' && 'Pedicure'}
              {specialty === 'NAIL_ART' && 'Nail Art'}
              {specialty === 'GEL_POLISH' && 'Esmalte en Gel'}
              {specialty === 'ACRYLIC_NAILS' && 'Uñas Acrílicas'}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
