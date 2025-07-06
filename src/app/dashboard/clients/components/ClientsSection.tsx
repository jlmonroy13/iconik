"use client"

import { DashboardSectionLayout } from '../../components/DashboardSectionLayout'
import { ClientStats } from './ClientStats'
import { ClientFilters } from './ClientFilters'
import { ClientList } from './ClientList'
import { ClientModal } from './ClientModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui'
import { Plus, Users } from 'lucide-react'
import type { Client, ClientFilters as ClientFiltersType } from '../types'
import { useState, useCallback } from 'react'

interface ClientsSectionProps {
  clients: Client[]
}

export function ClientsSection({ clients }: ClientsSectionProps) {
  const [filters, setFilters] = useState<ClientFiltersType>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const openCreateModal = useCallback(() => {
    setSelectedClient(undefined)
    setIsModalOpen(true)
  }, [])

  const handleEdit = useCallback((client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }, [])

  const handleDelete = useCallback((client: Client) => {
    setClientToDelete(client)
  }, [])

  const handleCreateOrUpdate = async () => {
    setIsSubmitting(true)
    try {
      // TODO: Implement API call to create/update client
      setIsModalOpen(false)
      setSelectedClient(undefined)
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!clientToDelete) return
    setIsDeleteLoading(true)
    try {
      // TODO: Implement API call to delete client
      setIsDeleteLoading(false)
      setClientToDelete(null)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const cancelDelete = () => {
    setClientToDelete(null)
  }

  // Filter clients based on filters
  const filteredClients = clients.filter(client => {
    if (filters.search && !client.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <DashboardSectionLayout
      icon={<Users className="w-8 h-8 text-blue-600" />}
      title="Clientes"
      description="Administra la base de datos de tus clientes y su historial."
      stats={<ClientStats total={clients.length} />}
      actionButton={
        <Button onClick={openCreateModal} variant="primary" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      }
    >
      <ClientFilters
        filters={filters}
        onFiltersChange={setFilters}
        resultsCount={filteredClients.length}
      />
      <div className="mt-6">
        {clients.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full">
            <p className="text-center py-8">No hay clientes registrados.</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-full">
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">No se encontraron clientes</h3>
              <p className="text-gray-500 dark:text-gray-400">Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.</p>
            </div>
          </div>
        ) : (
          <ClientList
            clients={filteredClients}
            filters={filters}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedClient(undefined)
        }}
        onSubmit={handleCreateOrUpdate}
        client={selectedClient}
        isSubmitting={isSubmitting}
      />
      <ConfirmDialog
        open={!!clientToDelete}
        title="Eliminar cliente"
        description={clientToDelete ? `¿Estás seguro de que deseas eliminar a ${clientToDelete.name}? Esta acción no se puede deshacer.` : ''}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleteLoading}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </DashboardSectionLayout>
  )
}
