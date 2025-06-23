import { ServiceStats } from '../types'
import { formatCurrency } from '@/lib/utils'
import { StatCard } from '@/components/ui'
import { BarChart, DollarSign, Star, Calendar } from 'lucide-react'

interface ServiceStatsProps {
  stats: ServiceStats
}

export function ServiceStatsCards({ stats }: ServiceStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <StatCard
        title="Total Servicios"
        value={stats.totalServices.toString()}
        icon={<BarChart className="text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
      />

      <StatCard
        title="Ingresos"
        value={formatCurrency(stats.totalRevenue)}
        mobileValue={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
        icon={<DollarSign className="text-green-600 dark:text-green-400" />}
        iconBgColor="bg-green-100 dark:bg-green-900/20"
      />

      <StatCard
        title="Rating Promedio"
        value={stats.averageRating.toFixed(1)}
        icon={<Star className="text-yellow-500 dark:text-yellow-400" />}
        iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
      />

      <StatCard
        title="Este Mes"
        value={stats.thisMonthServices.toString()}
        icon={<Calendar className="text-purple-600 dark:text-purple-400" />}
        iconBgColor="bg-purple-100 dark:bg-purple-900/20"
      />
    </div>
  )
}
