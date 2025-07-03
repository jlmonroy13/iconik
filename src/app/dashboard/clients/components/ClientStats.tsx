import { StatCard } from '@/components/ui/StatCard'
import { Client } from '../types'
import { Users } from 'lucide-react'

interface ClientStatsProps {
  clients: Client[]
}

export function ClientStats({ clients }: ClientStatsProps) {
  const total = clients.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Clientes"
        value={total}
        icon={<Users className="text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
      />
    </div>
  )
}
