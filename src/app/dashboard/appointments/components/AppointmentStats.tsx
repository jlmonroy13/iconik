'use client'

import { StatCard } from '@/components/ui'
import { CalendarCheck, CalendarX, CalendarDays, Star } from 'lucide-react'

interface AppointmentStatsProps {
  stats: {
    total: number
    completed?: number
    cancelled?: number
    mostPopularService?: string
  }
}

export function AppointmentStats({ stats }: AppointmentStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-2">
      <StatCard
        title="Total Citas"
        value={stats.total.toString()}
        icon={<CalendarDays className="text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
      />
      <StatCard
        title="Completadas"
        value={typeof stats.completed === 'number' ? stats.completed.toString() : 'N/A'}
        icon={<CalendarCheck className="text-green-600 dark:text-green-400" />}
        iconBgColor="bg-green-100 dark:bg-green-900/20"
      />
      <StatCard
        title="Canceladas"
        value={typeof stats.cancelled === 'number' ? stats.cancelled.toString() : 'N/A'}
        icon={<CalendarX className="text-red-600 dark:text-red-400" />}
        iconBgColor="bg-red-100 dark:bg-red-900/20"
      />
      <StatCard
        title="Servicio más popular"
        value={stats.mostPopularService || 'N/A'}
        icon={<Star className="text-yellow-600 dark:text-yellow-400" />}
        iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
      />
    </div>
  )
}
