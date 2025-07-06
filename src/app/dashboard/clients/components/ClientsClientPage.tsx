"use client"
import { useState } from 'react'
import { DashboardSectionLayout } from '../../components/DashboardSectionLayout'
import { ClientClientWrapper, ClientStats } from './'
import { Users, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Client, ClientStatsData } from '../types'

interface ClientsClientPageProps {
  clients: Client[]
  stats: ClientStatsData
}

export default function ClientsClientPage({ clients, stats }: ClientsClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined)

  const openCreateModal = () => {
    setSelectedClient(undefined)
    setIsModalOpen(true)
  }

  return (
    <DashboardSectionLayout
      icon={<Users className="w-8 h-8 text-blue-600" />}
      title="Clientes"
      description="Administra la base de datos de tus clientes y su historial."
      stats={<ClientStats total={stats.total} recent={stats.recent} />}
      actionButton={
        <Button onClick={openCreateModal} variant="primary" className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo Cliente
        </Button>
      }
    >
      <ClientClientWrapper
        clients={clients}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
      />
    </DashboardSectionLayout>
  )
}
