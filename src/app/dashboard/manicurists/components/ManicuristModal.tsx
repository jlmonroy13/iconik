'use client'

import { Modal } from '@/components/ui'
import { ManicuristForm } from './ManicuristForm'
import type { Manicurist } from '../types'
import type { ManicuristFormData } from '../schemas'
import type { Service } from '@/types'

// Extend ManicuristFormData to include selectedServices
type ExtendedManicuristFormData = ManicuristFormData & {
  selectedServices?: string[]
}

interface ManicuristModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ExtendedManicuristFormData) => Promise<void>
  manicurist?: Manicurist
  isSubmitting?: boolean
  services: Service[]
  selectedServices: string[]
  setSelectedServices: (ids: string[]) => void
}

export function ManicuristModal({
  isOpen,
  onClose,
  onSubmit,
  manicurist,
  isSubmitting,
  services,
  selectedServices,
  setSelectedServices
}: ManicuristModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={manicurist ? 'Editar Manicurista' : 'Nueva Manicurista'}
    >
      <ManicuristForm
        manicurist={manicurist}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        services={services}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
      />
    </Modal>
  )
}
