import { ServiceStats } from '../types'
import { formatCurrency } from '@/lib/utils'
import { StatCard } from '@/components/ui'

interface ServiceStatsProps {
  stats: ServiceStats
}

export function ServiceStatsCards({ stats }: ServiceStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        title="Total Servicios"
        value={stats.totalServices.toString()}
        icon="📊"
      />

      <StatCard
        title="Ingresos"
        value={formatCurrency(stats.totalRevenue)}
        mobileValue={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
        icon="💰"
      />

      <StatCard
        title="Rating Promedio"
        value={stats.averageRating.toFixed(1)}
        icon="⭐"
      />

      <StatCard
        title="Este Mes"
        value={stats.thisMonthServices.toString()}
        icon="📅"
      />
    </div>
  )
}
