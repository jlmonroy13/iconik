import { StatCard } from '@/components/ui'
import { BarChart, Users, CheckCircle, XCircle } from 'lucide-react'

interface ServiceStatsCardsProps {
  total: number
  active: number
  inactive: number
  mostRequestedServiceName: string
}

export function ServiceStatsCards({ total, active, inactive, mostRequestedServiceName }: ServiceStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <StatCard
        title="Total Servicios"
        value={total.toString()}
        icon={<BarChart className="text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
      />
      <StatCard
        title="Servicios Activos"
        value={active.toString()}
        icon={<CheckCircle className="text-green-600 dark:text-green-400" />}
        iconBgColor="bg-green-100 dark:bg-green-900/20"
      />
      <StatCard
        title="Servicios Inactivos"
        value={inactive.toString()}
        icon={<XCircle className="text-gray-500 dark:text-gray-400" />}
        iconBgColor="bg-gray-100 dark:bg-gray-900/20"
      />
      <StatCard
        title="Servicio más pedido"
        value={mostRequestedServiceName}
        icon={<Users className="text-pink-600 dark:text-pink-400" />}
        iconBgColor="bg-pink-100 dark:bg-pink-900/20"
      />
    </div>
  )
}
