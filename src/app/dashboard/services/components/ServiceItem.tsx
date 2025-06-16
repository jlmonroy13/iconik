import { Service } from '../types'
import { Badge, Avatar, RatingBadge } from '@/components/ui'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import {
  getServiceTypeIcon,
  getServiceTypeName,
  getPaymentMethodName
} from '../utils'

interface ServiceItemProps {
  service: Service
}

export function ServiceItem({ service }: ServiceItemProps) {
  return (
    <div className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-base">{getServiceTypeIcon(service.type)}</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                {getServiceTypeName(service.type)}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDateTime(service.createdAt)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar
                fallback={service.manicurist?.name?.charAt(0) || 'N'}
                size="md"
                variant="manicurist"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {service.manicurist?.name || 'Sin asignar'}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  atendió a <span className="font-medium text-gray-700 dark:text-gray-300">{service.client.name}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Meta */}
        <div className="flex flex-col sm:items-end space-y-2 sm:ml-6">
          <div className="flex items-center space-x-2 sm:flex-col sm:space-x-0 sm:space-y-1 sm:items-end">
            <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
              <span className="hidden sm:inline">{formatCurrency(service.price)}</span>
              <span className="sm:hidden">${(service.price / 1000).toFixed(0)}K</span>
            </span>

            <Badge variant="secondary">
              {getPaymentMethodName(service.paymentMethod)}
            </Badge>
          </div>

          {service.rating && (
            <RatingBadge rating={service.rating} />
          )}

          {service.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs italic">
              &ldquo;{service.notes}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
