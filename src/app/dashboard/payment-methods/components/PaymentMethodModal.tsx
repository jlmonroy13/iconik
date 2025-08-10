import { Modal } from '@/components/ui/Modal';
import { FadeIn } from '@/components/ui/PageTransition';
import { PaymentMethodForm, PaymentMethodFormData } from './PaymentMethodForm';
import type { PaymentMethod } from '../types';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentMethodFormData) => Promise<void>;
  method?: PaymentMethod;
  isSubmitting?: boolean;
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  onSubmit,
  method,
  isSubmitting,
}: PaymentMethodModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        method ? 'Actualizar Método de Pago' : 'Crear Nuevo Método de Pago'
      }
      description={
        method
          ? 'Modifica los datos del método de pago.'
          : 'Rellena el formulario para añadir un nuevo método de pago.'
      }
    >
      <FadeIn>
        <div className='mt-4'>
          <PaymentMethodForm
            onSubmit={onSubmit}
            method={method}
            isSubmitting={isSubmitting}
          />
        </div>
      </FadeIn>
    </Modal>
  );
}
