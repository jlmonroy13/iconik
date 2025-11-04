'use client';

import { Modal, Button } from '@/components/ui';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  loadingText?: string;
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
  loadingText,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  // Generate loading text from confirmText if not provided
  const getLoadingText = () => {
    if (loadingText) return loadingText;
    // Convert confirmText to loading text (e.g., "Confirmar" -> "Confirmando...")
    if (confirmText.endsWith('ar')) {
      return `${confirmText.slice(0, -2)}ando...`;
    }
    if (confirmText.endsWith('er')) {
      return `${confirmText.slice(0, -2)}iendo...`;
    }
    if (confirmText.endsWith('ir')) {
      return `${confirmText.slice(0, -2)}iendo...`;
    }
    return `${confirmText}...`;
  };

  return (
    <Modal
      isOpen={open}
      onClose={onCancel}
      title={title}
      description={description}
      size="sm"
      className="!h-auto max-h-[90vh]"
    >
      <div className="flex justify-end gap-3 pt-4 pb-2">
        <Button onClick={onCancel} variant="secondary" disabled={isLoading}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="destructive" disabled={isLoading}>
          {isLoading ? getLoadingText() : confirmText}
        </Button>
      </div>
    </Modal>
  );
}
