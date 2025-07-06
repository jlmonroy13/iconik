"use client"
import { useState, useCallback } from 'react'
import { ClientFilters, ClientList, ClientModal, EmptyState } from './'
import { PageTransition } from '@/components/ui/PageTransition'
import type { Client, ClientFilters as ClientFiltersType } from '../types'
import { SearchX } from 'lucide-react'
import type { ClientFormData } from '../schemas'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { createClient, updateClient, deleteClient } from '../actions'

interface ClientClientWrapperProps {
  clients: Client[]
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  selectedClient: Client | undefined
  setSelectedClient: (client: Client | undefined) => void
}

export function ClientClientWrapper({
  clients,
  isModalOpen,
  setIsModalOpen,
  selectedClient,
  setSelectedClient,
}: ClientClientWrapperProps) {
  const [filters, setFilters] = useState<ClientFiltersType>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const handleEdit = useCallback((client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }, [setSelectedClient, setIsModalOpen])

  const handleDelete = useCallback((client: Client) => {
    setClientToDelete(client)
  }, [])

  const handleCreateOrUpdate = async (data: ClientFormData) => {
    setIsSubmitting(true)
    try {
      if (selectedClient) {
        const result = await updateClient(selectedClient.id, data)
        if (!result.success) {
          throw new Error(result.message)
        }
      } else {
        const result = await createClient(data)
        if (!result.success) {
          throw new Error(result.message)
        }
      }
      setIsModalOpen(false)
      setSelectedClient(undefined)
    } catch (error) {
      console.error('Error creating/updating client:', error)
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!clientToDelete) return
    setIsDeleteLoading(true)
    try {
      const result = await deleteClient(clientToDelete.id)
      if (!result.success) {
        throw new Error(result.message)
      }
      setClientToDelete(null)
    } catch (error) {
      console.error('Error deleting client:', error)
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const cancelDelete = () => {
    setClientToDelete(null)
  }

  const clearFilters = () => {
    setFilters({})
  }

  // Filter clients based on filters
  const filteredClients = clients.filter(client => {
    if (filters.search && !client.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <PageTransition className="h-full">
      {/* Filters */}
      {clients.length > 0 && (
        <ClientFilters
          filters={filters}
          onFiltersChange={setFilters}
          resultsCount={filteredClients.length}
        />
      )}

      {/* Clients List */}
      <div className="mt-6">
        {clients.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <EmptyState
              title="No hay clientes registrados"
              description="Comienza agregando tu primer cliente para gestionar tu base de datos."
              icon={<SearchX className="w-12 h-12 mx-auto text-gray-400" />}
            />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <EmptyState
              title="No se encontraron clientes"
              description="Intenta ajustar los filtros de búsqueda para encontrar lo que buscas."
              icon={<SearchX className="w-12 h-12 mx-auto text-gray-400" />}
              onClearFilters={clearFilters}
            />
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
    </PageTransition>
  )
}
