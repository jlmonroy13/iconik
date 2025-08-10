'use client';

import { Modal } from '@/components/ui/Modal';
import { FadeIn } from '@/components/ui/PageTransition';
import { ClientForm } from './ClientForm';
import type { ClientFormData } from '../schemas';
import type { Client } from '../types';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
  client?: Client;
  isSubmitting?: boolean;
}

export function ClientModal({
  isOpen,
  onClose,
  onSubmit,
  client,
  isSubmitting,
}: ClientModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={client ? 'Actualizar Cliente' : 'Crear Nuevo Cliente'}
      description={
        client
          ? 'Modifica los datos del cliente.'
          : 'Rellena el formulario para añadir un nuevo cliente a la base de datos.'
      }
    >
      <FadeIn>
        <div className='mt-4'>
          <ClientForm
            onSubmit={onSubmit}
            client={client}
            isSubmitting={isSubmitting}
          />
        </div>
      </FadeIn>
    </Modal>
  );
}
