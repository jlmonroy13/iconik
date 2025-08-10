'use client';

import { Modal, ModalFooterButton, Button } from '@/components/ui';
import { ManicuristForm } from './ManicuristForm';
import type { Manicurist } from '../types';
import type { ManicuristFormData } from '../schemas';
import type { Service } from '@/types';
import { useId } from 'react';

// Extend ManicuristFormData to include selectedServices
type ExtendedManicuristFormData = ManicuristFormData & {
  selectedServices?: string[];
};

interface ManicuristModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExtendedManicuristFormData) => Promise<void>;
  manicurist?: Manicurist;
  isSubmitting?: boolean;
  services: Service[];
  selectedServices: string[];
  setSelectedServices: (ids: string[]) => void;
}

export function ManicuristModal({
  isOpen,
  onClose,
  onSubmit,
  manicurist,
  isSubmitting,
  services,
  selectedServices,
  setSelectedServices,
}: ManicuristModalProps) {
  const formId = useId();
  console.log('manicurist', manicurist);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={manicurist ? 'Editar Manicurista' : 'Nueva Manicurista'}
      className='max-w-4xl'
      formId={formId}
      footer={
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <ModalFooterButton
            formId={formId}
            disabled={isSubmitting}
            className='min-w-[140px]'
          >
            {isSubmitting
              ? 'Guardando...'
              : manicurist
                ? 'Actualizar'
                : 'Crear'}{' '}
            Manicurista
          </ModalFooterButton>
        </div>
      }
    >
      <ManicuristForm
        manicurist={manicurist}
        onSubmit={onSubmit}
        services={services}
        selectedServices={selectedServices}
        setSelectedServices={setSelectedServices}
        formId={formId}
      />
    </Modal>
  );
}
