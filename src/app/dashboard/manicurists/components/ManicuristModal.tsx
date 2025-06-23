'use client'

import { Modal } from '@/components/ui'
import { ManicuristForm } from './ManicuristForm'
import type { Manicurist } from '../types'
import type { ManicuristFormData } from '../schemas'

interface ManicuristModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ManicuristFormData) => Promise<void>
  manicurist?: Manicurist
  isSubmitting?: boolean
}

export function ManicuristModal({
  isOpen,
  onClose,
  onSubmit,
  manicurist,
  isSubmitting
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
      />
    </Modal>
  )
}
