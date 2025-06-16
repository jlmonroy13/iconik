import { Manicurist } from '../types'
import { Badge, Avatar, RatingBadge } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { getServiceTypeIcon, getServiceTypeName, getStatusBadgeVariant, getStatusText } from '../utils'

interface ManicuristCardProps {
  manicurist: Manicurist
}

export function ManicuristCard({ manicurist }: ManicuristCardProps) {
  return (
    <div className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar
              fallback={manicurist.name.charAt(0)}
              size="lg"
              variant="manicurist"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                  {manicurist.name}
                </h3>
                <Badge variant={getStatusBadgeVariant(manicurist.status)}>
                  {getStatusText(manicurist.status)}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {manicurist.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {manicurist.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {manicurist.specialties.map(specialty => (
              <Badge key={specialty} variant="secondary">
                <span className="mr-1">{getServiceTypeIcon(specialty)}</span>
                {getServiceTypeName(specialty)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Manicurist Meta */}
        <div className="flex flex-col sm:items-end space-y-2 sm:ml-6">
          <div className="flex items-center space-x-2 sm:flex-col sm:space-x-0 sm:space-y-1 sm:items-end">
            <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
              <span className="hidden sm:inline">{formatCurrency(manicurist.totalRevenue)}</span>
              <span className="sm:hidden">${(manicurist.totalRevenue / 1000).toFixed(0)}K</span>
            </span>
            <Badge variant="secondary">
              {manicurist.totalServices} servicios
            </Badge>
          </div>

          <RatingBadge rating={manicurist.rating} />

          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span>Este mes: {manicurist.thisMonthServices} servicios</span>
            <span>·</span>
            <span>{formatCurrency(manicurist.thisMonthRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
