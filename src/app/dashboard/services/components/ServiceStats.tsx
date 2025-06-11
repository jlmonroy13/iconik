import { ServiceStats } from '../types'
import { formatCurrency } from '../utils'

interface ServiceStatsProps {
  stats: ServiceStats
}

export function ServiceStatsCards({ stats }: ServiceStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📊</span>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Servicios</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{stats.totalServices}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">💰</span>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Ingresos</p>
            <p className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">
              <span className="hidden sm:inline">
                {formatCurrency(stats.totalRevenue)}
              </span>
              <span className="sm:hidden">
                ${(stats.totalRevenue / 1000).toFixed(0)}K
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">⭐</span>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Rating Promedio</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {stats.averageRating.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📅</span>
          <div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Este Mes</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {stats.thisMonthServices}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
