"use client"
import { useState } from 'react'
import { DashboardSectionLayout } from '../../components/DashboardSectionLayout'
import { ServiceClientWrapper } from './ServiceClientWrapper'
import { ServiceStatsCards } from './ServiceStats'
import { Package, Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import type { Service, ServiceStats } from '../types'

interface ServicesClientPageProps {
  services: Service[]
  stats: ServiceStats
}

export default function ServicesClientPage({ services, stats }: ServicesClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined)

  const openCreateModal = () => {
    setSelectedService(undefined)
    setIsModalOpen(true)
  }

  return (
    <DashboardSectionLayout
      icon={<Package className="w-8 h-8 text-blue-600" />}
      title="Catálogo de Servicios"
      description="Administra los servicios que ofrece tu spa. Agrega, edita o elimina servicios del catálogo."
      stats={<ServiceStatsCards {...stats} />}
      actionButton={
        <Button onClick={openCreateModal} variant="primary" className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo Servicio
        </Button>
      }
    >
      <ServiceClientWrapper
        services={services}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
      />
    </DashboardSectionLayout>
  )
}
