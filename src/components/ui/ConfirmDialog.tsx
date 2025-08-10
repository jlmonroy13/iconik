'use client';

import { Modal, Button } from '@/components/ui';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  isLoading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onCancel}
      title={title}
      description={description}
    >
      <div className='flex justify-end gap-2 pt-6'>
        <Button onClick={onCancel} variant='secondary' disabled={isLoading}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant='destructive' disabled={isLoading}>
          {isLoading ? 'Eliminando...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
}
