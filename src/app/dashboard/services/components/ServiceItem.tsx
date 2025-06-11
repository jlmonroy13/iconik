import { Service } from '../types'
import {
  formatCurrency,
  formatDate,
  getServiceTypeIcon,
  getServiceTypeName,
  getPaymentMethodName,
  getRatingStars
} from '../utils'

interface ServiceItemProps {
  service: Service
}

export function ServiceItem({ service }: ServiceItemProps) {
  return (
    <div className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Service Icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-lg sm:text-xl">{getServiceTypeIcon(service.type)}</span>
        </div>

        {/* Service Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                {getServiceTypeName(service.type)}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Cliente: <span className="font-medium">{service.client.name}</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Manicurista: <span className="font-medium">{service.manicurist?.name || 'N/A'}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatDate(service.createdAt)}
              </p>
            </div>

            {/* Service Meta */}
            <div className="flex flex-col sm:items-end space-y-1">
              <div className="flex items-center space-x-2 sm:flex-col sm:space-x-0 sm:space-y-1 sm:items-end">
                <span className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                  <span className="hidden sm:inline">{formatCurrency(service.price)}</span>
                  <span className="sm:hidden">${(service.price / 1000).toFixed(0)}K</span>
                </span>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  {getPaymentMethodName(service.paymentMethod)}
                </span>
              </div>

              {service.rating && (
                <div className="text-xs sm:text-sm">
                  {getRatingStars(service.rating)}
                </div>
              )}

              {service.notes && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                  &ldquo;{service.notes}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
