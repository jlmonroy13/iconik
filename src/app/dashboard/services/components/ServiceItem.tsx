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
  const ServiceIcon = getServiceTypeIcon(service.type)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3">
      <div className="flex items-start justify-between space-x-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              {ServiceIcon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {getServiceTypeName(service.type)}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDateTime(service.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-2 flex items-center space-x-2">
            <Avatar
              fallback={service.manicurist?.name?.charAt(0) || 'N'}
              size="sm"
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

        {/* Service Meta */}
        <div className="flex flex-col items-end space-y-1">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            {formatCurrency(service.price)}
          </span>

          <Badge variant="secondary">
            {getPaymentMethodName(service.paymentMethod)}
          </Badge>

          {service.rating && (
            <RatingBadge rating={service.rating} />
          )}

          {service.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[150px] text-right italic">
              &ldquo;{service.notes}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
