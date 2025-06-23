'use client'

import { StatCard } from '@/components/ui'
import type { AppointmentStats as AppointmentStatsType } from '../types'
import { Calendar, Clock, Check, PartyPopper, XCircle } from 'lucide-react'

interface AppointmentStatsProps {
  stats: AppointmentStatsType
}

export function AppointmentStats({ stats }: AppointmentStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-6">
      <StatCard
        title="Total Citas"
        value={stats.total}
        icon={<Calendar className="text-purple-600 dark:text-purple-400" />}
        iconBgColor="bg-purple-100 dark:bg-purple-900/20"
      />
      <StatCard
        title="Programadas"
        value={stats.scheduled}
        icon={<Clock className="text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
      />
      <StatCard
        title="Confirmadas"
        value={stats.confirmed}
        icon={<Check className="text-green-600 dark:text-green-400" />}
        iconBgColor="bg-green-100 dark:bg-green-900/20"
      />
      <StatCard
        title="Completadas"
        value={stats.completed}
        icon={<PartyPopper className="text-pink-600 dark:text-pink-400" />}
        iconBgColor="bg-pink-100 dark:bg-pink-900/20"
      />
      <StatCard
        title="Canceladas"
        value={stats.cancelled}
        icon={<XCircle className="text-red-600 dark:text-red-400" />}
        iconBgColor="bg-red-100 dark:bg-red-900/20"
      />
    </div>
  )
}
