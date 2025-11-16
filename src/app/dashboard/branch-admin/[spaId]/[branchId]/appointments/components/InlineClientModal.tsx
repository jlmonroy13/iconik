'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input } from '@/components/ui';
import type { CreateClientData } from '@/types/forms';
import { createClient } from '../../clients/actions';

interface InlineClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: {
    id: string;
    name: string;
    phone: string;
  }) => void;
  spaId: string;
  branchId: string;
}

export function InlineClientModal({
  isOpen,
  onClose,
  onClientCreated,
  spaId,
  branchId,
}: InlineClientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      documentType: 'CC' as const,
      documentNumber: '',
      phone: '',
      email: '',
      birthday: '',
      notes: '',
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: '',
        documentType: 'CC',
        documentNumber: '',
        phone: '',
        email: '',
        birthday: '',
        notes: '',
      });
      setError(null);
    }
  }, [isOpen, form]);

  const onSubmit = async (data: CreateClientData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createClient(spaId, branchId, data);

      if (result.success && result.data) {
        // Call the callback with the new client data
        onClientCreated({
          id: result.data.id,
          name: result.data.name,
          phone: result.data.phone || '',
        });
        onClose();
      } else {
        setError(result.error || 'Error al crear el cliente');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Crear Cliente Rápido"
      size="md"
      className="h-[unset]"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Required fields only for quick creation */}
        <Input
          label="Nombre Completo *"
          {...form.register('name', { required: 'El nombre es requerido' })}
          placeholder="Nombre completo del cliente"
          error={form.formState.errors.name?.message}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Documento *"
            {...form.register('documentNumber', {
              required: 'El documento es requerido',
            })}
            placeholder="Número de documento"
            error={form.formState.errors.documentNumber?.message}
          />

          <Input
            label="Teléfono *"
            {...form.register('phone', {
              required: 'El teléfono es requerido',
            })}
            placeholder="Ej: 3001234567"
            error={form.formState.errors.phone?.message}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? 'Creando...' : 'Crear y Seleccionar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
