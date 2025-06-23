'use client'

import { useState, useMemo, useEffect } from 'react'
import { STATIC_SERVICES, SERVICE_HISTORY } from './data'
import { ServiceFilters } from './types'
import { filterServices, calculateStats, getUniqueManicurists, getMostRequestedServiceName } from './utils'
import {
  ServiceStatsCards,
  ServiceFiltersPanel,
  ServiceItem,
  EmptyState,
  ServiceModal
} from './components'
import { PageTransition, FadeIn, EmptyServices, StatsSkeleton, Skeleton, Button } from '@/components/ui'
import { Plus } from 'lucide-react'
import type { ServiceFormData } from './schemas'
import type { Service } from './types'
import { mockServices } from './types'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export default function ServicesPage() {
  const [services] = useState(STATIC_SERVICES)
  const [filters, setFilters] = useState<ServiceFilters>({
    serviceType: '',
    manicurist: '',
    dateFrom: '',
    dateTo: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [servicesList, setServicesList] = useState<Service[]>(mockServices)
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Memoized calculations for performance
  const filteredServices = useMemo(() =>
    filterServices(services, filters),
    [services, filters]
  )

  const stats = useMemo(() => {
    const { total, active, inactive } = calculateStats(servicesList)
    const mostRequestedServiceName = getMostRequestedServiceName(SERVICE_HISTORY, servicesList)
    return { total, active, inactive, mostRequestedServiceName }
  }, [servicesList])

  const uniqueManicurists = useMemo(() =>
    getUniqueManicurists(services),
    [services]
  )

  const clearFilters = () => {
    setFilters({ serviceType: '', manicurist: '', dateFrom: '', dateTo: '' })
  }

  const openCreateModal = () => {
    setSelectedService(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (service: Service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleCreateOrUpdate = async (data: ServiceFormData) => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      if (selectedService) {
        setServicesList(prev => prev.map(s =>
          s.id === selectedService.id ? { ...s, ...data } : s
        ))
      } else {
        const newService: Service = {
          id: `service_${Date.now()}`,
          ...data,
        }
        setServicesList(prev => [newService, ...prev])
      }
      setIsModalOpen(false)
      setSelectedService(undefined)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (service: Service) => {
    setServiceToDelete(service)
  }

  const confirmDelete = async () => {
    if (!serviceToDelete) return
    setIsDeleteLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setServicesList(prev => prev.filter(s => s.id !== serviceToDelete.id))
    setIsDeleteLoading(false)
    setServiceToDelete(null)
  }

  const cancelDelete = () => {
    setServiceToDelete(null)
  }

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton variant="text" width="40%" height="32px" />
            <Skeleton variant="text" width="50%" />
          </div>
          <StatsSkeleton />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height="76px" />
            ))}
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="h-full">
      <div className="flex h-full flex-col">
        {/* Fixed Header, Stats, and Filters */}
        <div className="flex-shrink-0">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Catálogo de Servicios
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Administra los servicios que ofrece tu spa. Agrega, edita o elimina servicios del catálogo.
                </p>
              </div>
              <Button onClick={openCreateModal} variant="primary" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Servicio
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <ServiceStatsCards
              total={stats.total}
              active={stats.active}
              inactive={stats.inactive}
              mostRequestedServiceName={stats.mostRequestedServiceName}
            />
          </FadeIn>

          {(services.length > 0 || isLoading) && (
            <FadeIn delay={400}>
              <ServiceFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                uniqueManicurists={uniqueManicurists}
                resultsCount={filteredServices.length}
              />
            </FadeIn>
          )}
        </div>

        {/* Scrollable List */}
        <div className="mt-6 flex-grow overflow-y-auto pr-2 min-h-0">
          <FadeIn delay={600}>
            {servicesList.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full">
                <EmptyServices />
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredServices.map((service, index) => (
                  <FadeIn key={service.id} delay={index * 100}>
                    <ServiceItem service={service} onEdit={() => handleEdit(service)} onDelete={() => handleDelete(service)} />
                  </FadeIn>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full">
                <EmptyState onClearFilters={clearFilters} />
              </div>
            )}
          </FadeIn>
        </div>
      </div>
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedService(undefined)
        }}
        onSubmit={handleCreateOrUpdate}
        service={selectedService}
        isSubmitting={isSubmitting}
      />
      <ConfirmDialog
        open={!!serviceToDelete}
        title="Eliminar servicio"
        description={serviceToDelete ? `¿Estás seguro de que deseas eliminar el servicio "${serviceToDelete.name}"? Esta acción no se puede deshacer.` : ''}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleteLoading}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </PageTransition>
  )
}
