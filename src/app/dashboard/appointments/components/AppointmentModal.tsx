'use client'

import { Modal } from '@/components/ui'
import { AppointmentForm } from './AppointmentForm'
import type { AppointmentWithDetails } from '@/types'
import type { AppointmentFormData } from '../schemas'

interface Option {
  id: string
  name: string
}

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment?: AppointmentWithDetails
  clients: Option[]
  manicurists: Option[]
  services: Option[]
  onSubmit: (data: AppointmentFormData) => Promise<void>
  onCreateClient?: (initialName?: string) => void
  isSubmitting?: boolean
}

export function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  clients,
  manicurists,
  services,
  onSubmit,
  onCreateClient,
  isSubmitting
}: AppointmentModalProps) {
  const handleSubmit = async (data: AppointmentFormData) => {
    await onSubmit(data)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={appointment ? 'Editar Cita' : 'Nueva Cita'}
    >
      <AppointmentForm
        appointment={appointment}
        clients={clients}
        manicurists={manicurists}
        services={services}
        onSubmit={handleSubmit}
        onCreateClient={onCreateClient}
        isSubmitting={isSubmitting}
      />
    </Modal>
  )
}
