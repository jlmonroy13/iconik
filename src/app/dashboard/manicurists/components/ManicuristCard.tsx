import { Avatar } from '@/components/ui'
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
            fallback={manicurist.name.charAt(0)}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {manicurist.name}
              </h3>
            </div>
            {manicurist.email && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {manicurist.email}
              </p>
            )}
            {manicurist.phone && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {manicurist.phone}
              </p>
            )}
            {manicurist.specialty && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Especialidad: {manicurist.specialty}
              </p>
            )}
          </div>
        </div>
        {/* Edit button */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="ml-auto p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <span className="sr-only">Editar</span>
            ✏️
          </button>
        )}
      </div>
    </div>
  )
}
