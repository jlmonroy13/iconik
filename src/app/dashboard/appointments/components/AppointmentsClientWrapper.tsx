"use client"
import { useState, useCallback } from 'react'
import { AppointmentFilters } from './AppointmentFilters'
import { AppointmentList } from './AppointmentList'
import { AppointmentModal } from './AppointmentModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '../../clients/components/EmptyState'
import type { AppointmentWithDetails } from '../types'

interface Option {
  id: string
  name: string
}

interface AppointmentsClientWrapperProps {
  appointments: AppointmentWithDetails[]
  clients: Option[]
  manicurists: Option[]
  services: Option[]
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  selectedAppointment: AppointmentWithDetails | undefined
  setSelectedAppointment: (appointment: AppointmentWithDetails | undefined) => void
}

export function AppointmentsClientWrapper({
  appointments,
  clients,
  manicurists,
  services,
  isModalOpen,
  setIsModalOpen,
  selectedAppointment,
  setSelectedAppointment,
}: AppointmentsClientWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentWithDetails | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const handleEdit = useCallback((appointment: AppointmentWithDetails) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }, [setSelectedAppointment, setIsModalOpen])

  const handleDelete = useCallback((appointment: AppointmentWithDetails) => {
    setAppointmentToDelete(appointment)
  }, [])

  const handleCreateOrUpdate = async () => {
    setIsSubmitting(true)
    try {
      // TODO: Implement create/update logic with server actions
      setIsModalOpen(false)
      setSelectedAppointment(undefined)
    } catch (error) {
      console.error('Error creating/updating appointment:', error)
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!appointmentToDelete) return
    setIsDeleteLoading(true)
    try {
      // TODO: Implement delete logic with server actions
      setAppointmentToDelete(null)
    } catch (error) {
      console.error('Error deleting appointment:', error)
      // TODO: Add proper error handling/toast notification
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const cancelDelete = () => {
    setAppointmentToDelete(null)
  }

  const clearFilters = () => {
    // setFilters({})
  }

  // TODO: Implement real filtering logic
  const filteredAppointments = appointments

  return (
    <div className="h-full">
      {/* Filters */}
      {appointments.length > 0 && (
        <AppointmentFilters />
      )}

      {/* Appointments List */}
      <div className="mt-6">
        {appointments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <EmptyState
              title="No hay citas registradas"
              description="Comienza agregando tu primera cita para gestionar tu agenda."
              icon={<span className="text-4xl">📅</span>}
            />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <EmptyState
              title="No se encontraron citas"
              description="Intenta ajustar los filtros de búsqueda para encontrar lo que buscas."
              icon={<span className="text-4xl">🔍</span>}
              onClearFilters={clearFilters}
            />
          </div>
        ) : (
          <AppointmentList
            appointments={filteredAppointments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedAppointment(undefined)
        }}
        onSubmit={handleCreateOrUpdate}
        appointment={selectedAppointment}
        clients={clients}
        manicurists={manicurists}
        services={services}
        isSubmitting={isSubmitting}
      />
      <ConfirmDialog
        open={!!appointmentToDelete}
        title="Eliminar cita"
        description={appointmentToDelete ? `¿Estás seguro de que deseas eliminar la cita de ${appointmentToDelete.client.name}? Esta acción no se puede deshacer.` : ''}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleteLoading}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  )
}
