import { getClients, getClientStats } from './actions'
import { DashboardSectionLayout } from '../components/DashboardSectionLayout'
import { Users } from 'lucide-react'
import { ClientsClientPage } from './components'
import type { Client } from './types'

export default async function ClientsPage() {
  const clientsResult = await getClients()
  const statsResult = await getClientStats()
  console.log('clientsResult', clientsResult)

  if (!clientsResult.success) {
    return (
      <DashboardSectionLayout
        icon={<Users className="w-8 h-8 text-blue-600" />}
        title="Clientes"
        description="Administra la base de datos de tus clientes y su historial."
        stats={null}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-lg font-bold mb-2">Error al cargar los clientes</h2>
          <p className="text-gray-500 dark:text-gray-400">{clientsResult.message}</p>
        </div>
      </DashboardSectionLayout>
    )
  }

  const clients = (clientsResult.data || []) as Client[]
  const stats = statsResult.success && statsResult.data
    ? statsResult.data
    : {
        total: 0,
        recent: 0,
      };

  return (
    <ClientsClientPage
      clients={clients}
      stats={stats}
    />
  )
}


