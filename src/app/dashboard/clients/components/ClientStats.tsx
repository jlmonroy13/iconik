import { StatCard } from '@/components/ui/StatCard'
import { Client } from '../types'
import { Users, UserCheck, Trophy } from 'lucide-react'

interface ClientStatsProps {
  clients: Client[]
}

export function ClientStats({ clients }: ClientStatsProps) {
  const total = clients.length
  const active = clients.filter(c => c.status === 'ACTIVE').length
  const mostVisits = clients.length > 0 ? Math.max(...clients.map(c => c.visits)) : 0
  const frequent = clients.filter(c => c.visits === mostVisits)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard
        title="Total Clientes"
        value={total}
        icon={<Users className="text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
      />
      <StatCard
        title="Clientes Activos"
        value={active}
        icon={<UserCheck className="text-green-600 dark:text-green-400" />}
        iconBgColor="bg-green-100 dark:bg-green-900/20"
      />
      <StatCard
        title="Más Frecuentes"
        value={frequent.length > 0 ? frequent.map(c => c.name).join(', ') : '-'}
        icon={<Trophy className="text-yellow-500 dark:text-yellow-400" />}
        iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
      />
    </div>
  )
}
