'use client'

import { useState, createContext, useContext } from 'react'
import { ConfirmDialog } from '@/components/ui'
import { AppointmentModal } from './AppointmentModal'
import { ClientModal } from '../../clients/components/ClientModal'
import type { Appointment } from '../types'
import type { AppointmentFormData } from '../schemas'
import type { ClientFormData } from '../../clients/schemas'

interface Option {
  id: string
  name: string
}

interface AppointmentsContextType {
  handleCreate: () => void
  handleEdit: (appointment: Appointment) => void
  handleDelete: (appointment: Appointment) => void
  handleCreateClient: (initialName?: string, setValue?: (name: keyof AppointmentFormData, value: string | number | Date) => void) => void
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function useAppointments() {
  const context = useContext(AppointmentsContext)
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentsClient')
  }
  return context
}

interface AppointmentsClientProps {
  clients: Option[]
  manicurists: Option[]
  services: Option[]
  children: React.ReactNode
}

export function AppointmentsClient({
  clients: initialClients,
  manicurists,
  services,
  children
}: AppointmentsClientProps) {
  const [clients, setClients] = useState<Option[]>(initialClients)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [clientFormSetValue, setClientFormSetValue] = useState<((name: keyof AppointmentFormData, value: string | number | Date) => void) | null>(null)

  const handleCreate = () => {
    setSelectedAppointment(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleDelete = (appointment: Appointment) => {
    setAppointmentToDelete(appointment)
    setIsDeleteDialogOpen(true)
  }

  const handleCreateClient = (initialName?: string, setValue?: (name: keyof AppointmentFormData, value: string | number | Date) => void) => {
    setClientFormSetValue(() => setValue || null)
    setIsClientModalOpen(true)
  }

  const handleSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement API call
      console.log('Submitting appointment:', data)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClientSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement API call to create client
      console.log('Creating client:', data)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

      // Simulate adding the new client to the list
      const newClient: Option = {
        id: `client-${Date.now()}`, // This would come from the API
        name: data.name
      }
      setClients(prev => [...prev, newClient])

      // Close the client modal
      setIsClientModalOpen(false)

      // Select the newly created client in the appointment form
      if (clientFormSetValue) {
        clientFormSetValue('clientId', newClient.id)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return

    setIsSubmitting(true)
    try {
      // TODO: Implement API call
      console.log('Deleting appointment:', appointmentToDelete.id)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setIsDeleteDialogOpen(false)
      setAppointmentToDelete(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAppointment(undefined)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setAppointmentToDelete(null)
  }

  const handleCloseClientModal = () => {
    setIsClientModalOpen(false)
    setClientFormSetValue(null)
  }

  const contextValue: AppointmentsContextType = {
    handleCreate,
    handleEdit,
    handleDelete,
    handleCreateClient
  }

  return (
    <AppointmentsContext.Provider value={contextValue}>
      {children}

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        appointment={selectedAppointment}
        clients={clients}
        manicurists={manicurists}
        services={services}
        onSubmit={handleSubmit}
        onCreateClient={handleCreateClient}
        isSubmitting={isSubmitting}
      />

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={handleCloseClientModal}
        onSubmit={handleClientSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Eliminar Cita"
        description={`¿Estás seguro de que quieres eliminar la cita de ${appointmentToDelete?.client.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isSubmitting}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </AppointmentsContext.Provider>
  )
}
