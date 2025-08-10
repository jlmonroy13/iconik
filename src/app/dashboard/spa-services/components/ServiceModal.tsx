'use client';

import { Modal, FadeIn } from '@/components/ui';
import { ServiceForm } from './ServiceForm';
import type { ServiceFormData } from '../schemas';
import type { Service } from '../types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  service?: Service;
  isSubmitting?: boolean;
}

export function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  service,
  isSubmitting,
}: ServiceModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? 'Actualizar Servicio' : 'Crear Nuevo Servicio'}
      description={
        service
          ? 'Modifica los datos del servicio.'
          : 'Rellena el formulario para añadir un nuevo servicio.'
      }
    >
      <FadeIn>
        <div className='mt-4'>
          <ServiceForm
            onSubmit={onSubmit}
            service={service}
            isSubmitting={isSubmitting}
          />
        </div>
      </FadeIn>
    </Modal>
  );
}
