'use client'

import { StatCard } from '@/components/ui'
import type { AppointmentStats as AppointmentStatsType } from '../types'

interface AppointmentStatsProps {
  stats: AppointmentStatsType
}

export function AppointmentStats({ stats }: AppointmentStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-6">
      <StatCard
        title="Total Citas"
        value={stats.total}
        icon="📅"
      />
      <StatCard
        title="Programadas"
        value={stats.scheduled}
        icon="⏰"
      />
      <StatCard
        title="Confirmadas"
        value={stats.confirmed}
        icon="✅"
      />
      <StatCard
        title="Completadas"
        value={stats.completed}
        icon="🎉"
      />
      <StatCard
        title="Canceladas"
        value={stats.cancelled}
        icon="❌"
      />
    </div>
  )
}
