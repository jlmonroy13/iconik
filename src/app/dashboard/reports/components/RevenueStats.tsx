'use client'

import { StatCard } from '@/components/ui'
import type { RevenueStats as RevenueStatsType } from '../types'

interface RevenueStatsProps {
  stats: RevenueStatsType
}

export function RevenueStats({ stats }: RevenueStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600 dark:text-green-400'
    if (growth < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return '📈'
    if (growth < 0) return '📉'
    return '➡️'
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      <StatCard
        title="Ingresos Totales"
        value={formatCurrency(stats.totalRevenue)}
        icon="💰"
        description="Todos los tiempos"
      />

      <StatCard
        title="Servicios Realizados"
        value={stats.totalServices}
        icon="💅"
        description="Total de servicios"
      />

      <StatCard
        title="Clientes Registrados"
        value={stats.totalClients}
        icon="👥"
        description="Base de clientes"
      />

      <StatCard
        title="Calificación Promedio"
        value={`${stats.averageRating}/5`}
        icon="⭐"
        description="Satisfacción del cliente"
      />

      <StatCard
        title="Crecimiento Mensual"
        value={
          <span className={getGrowthColor(stats.monthlyGrowth)}>
            {stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth}%
          </span>
        }
        icon={getGrowthIcon(stats.monthlyGrowth)}
        description="vs mes anterior"
      />
    </div>
  )
}
