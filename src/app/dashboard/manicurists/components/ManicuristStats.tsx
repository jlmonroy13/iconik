import { ManicuristStats } from '../types'
import { StatCard } from '@/components/ui'
import { Users, UserCheck, Star } from 'lucide-react'

interface ManicuristStatsProps {
  stats: ManicuristStats
}

export function ManicuristStatsCards({ stats }: ManicuristStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Total Manicuristas"
        value={stats.totalManicurists.toString()}
        icon={<Users className="text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
      />
      <StatCard
        title="Manicuristas Activos"
        value={stats.activeManicurists.toString()}
        icon={<UserCheck className="text-green-600 dark:text-green-400" />}
        iconBgColor="bg-green-100 dark:bg-green-900/20"
      />
      <StatCard
        title="Rating Promedio"
        value={stats.averageRating.toFixed(1)}
        icon={<Star className="text-yellow-500 dark:text-yellow-400" />}
        iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
      />
    </div>
  )
}
