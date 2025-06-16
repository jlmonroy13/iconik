import { ManicuristStats } from '../types'
import { StatCard } from '@/components/ui'

interface ManicuristStatsProps {
  stats: ManicuristStats
}

export function ManicuristStatsCards({ stats }: ManicuristStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Total Manicuristas"
        value={stats.totalManicurists.toString()}
        icon="👥"
      />
      <StatCard
        title="Manicuristas Activos"
        value={stats.activeManicurists.toString()}
        icon="✅"
      />
      <StatCard
        title="Rating Promedio"
        value={stats.averageRating.toFixed(1)}
        icon="⭐"
      />
    </div>
  )
}
