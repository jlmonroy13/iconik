import { StatCard } from '@/components/ui/StatCard'
import { Client } from '../types'

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
        icon="👥"
      />
      <StatCard
        title="Clientes Activos"
        value={active}
        icon="✅"
      />
      <StatCard
        title="Más Frecuentes"
        value={frequent.length > 0 ? frequent.map(c => c.name).join(', ') : '-'}
        icon="🏆"
      />
    </div>
  )
}
