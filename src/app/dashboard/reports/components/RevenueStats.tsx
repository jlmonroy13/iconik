'use client'

import { StatCard } from '@/components/ui'
import type { RevenueStats as RevenueStatsType } from '../types'
import { DollarSign, Sparkles, Users, Star, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'

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
    if (growth > 0) return <TrendingUp className="text-green-600 dark:text-green-400" />
    if (growth < 0) return <TrendingDown className="text-red-600 dark:text-red-400" />
    return <ArrowRight className="text-gray-600 dark:text-gray-400" />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      <StatCard
        title="Ingresos Totales"
        value={formatCurrency(stats.totalRevenue)}
        icon={<DollarSign className="text-green-600 dark:text-green-400" />}
        iconBgColor="bg-green-100 dark:bg-green-900/20"
        description="Todos los tiempos"
      />

      <StatCard
        title="Servicios Realizados"
        value={stats.totalServices}
        icon={<Sparkles className="text-pink-600 dark:text-pink-400" />}
        iconBgColor="bg-pink-100 dark:bg-pink-900/20"
        description="Total de servicios"
      />

      <StatCard
        title="Clientes Registrados"
        value={stats.totalClients}
        icon={<Users className="text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
        description="Base de clientes"
      />

      <StatCard
        title="Calificación Promedio"
        value={`${stats.averageRating}/5`}
        icon={<Star className="text-yellow-500 dark:text-yellow-400" />}
        iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
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
        iconBgColor={
          stats.monthlyGrowth > 0
            ? 'bg-green-100 dark:bg-green-900/20'
            : stats.monthlyGrowth < 0
            ? 'bg-red-100 dark:bg-red-900/20'
            : 'bg-gray-100 dark:bg-gray-700'
        }
        description="vs mes anterior"
        className="lg:col-span-1"
      />
    </div>
  )
}
