import { StatCard } from '@/components/ui'
import { Users, UserCheck, UserX, UserPlus } from 'lucide-react'

interface ClientStatsProps {
  total: number
  recent: number
}

export function ClientStats({ total, recent }: ClientStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-2">
      <StatCard
        title="Total Clientes"
        value={(total ?? 0).toString()}
        icon={<Users className="text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
      />
      <StatCard
        title="Activos"
        value={"N/A"}
        icon={<UserCheck className="text-green-600 dark:text-green-400" />}
        iconBgColor="bg-green-100 dark:bg-green-900/20"
      />
      <StatCard
        title="Inactivos"
        value={"N/A"}
        icon={<UserX className="text-gray-500 dark:text-gray-400" />}
        iconBgColor="bg-gray-100 dark:bg-gray-900/20"
      />
      <StatCard
        title="Nuevos este mes"
        value={(recent ?? 0).toString()}
        icon={<UserPlus className="text-pink-600 dark:text-pink-400" />}
        iconBgColor="bg-pink-100 dark:bg-pink-900/20"
      />
    </div>
  )
}
