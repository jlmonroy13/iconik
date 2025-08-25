'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { DOCUMENT_TYPES } from '@/types/clients';
import { createClientSchema, type CreateClientData } from '@/types/forms';
import type { ClientWithAppointmentCount } from '@/types/clients';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaId: string;
  branchId: string;
  mode: 'create' | 'edit';
  client?: ClientWithAppointmentCount | null;
}

export function ClientModal({
  isOpen,
  onClose,
  spaId,
  branchId,
  mode,
  client,
}: ClientModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateClientData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: '',
      documentType: 'CC',
      documentNumber: '',
      phone: '',
      email: '',
      birthday: '',
      notes: '',
    },
  });

  // Reset form when modal opens/closes or client changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && client) {
        form.reset({
          name: client.name,
          documentType: client.documentType as
            | 'CC'
            | 'TI'
            | 'CE'
            | 'PA'
            | 'NIT',
          documentNumber: client.documentNumber,
          phone: client.phone || '',
          email: client.email || '',
          birthday: client.birthday
            ? new Date(client.birthday).toISOString().split('T')[0]
            : '',
          notes: client.notes || '',
        });
      } else {
        form.reset({
          name: '',
          documentType: 'CC',
          documentNumber: '',
          phone: '',
          email: '',
          birthday: '',
          notes: '',
        });
      }
      setError(null);
    }
  }, [isOpen, mode, client, form]);

  const onSubmit = async (data: CreateClientData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const url =
        mode === 'create'
          ? `/api/spas/${spaId}/branches/${branchId}/clients`
          : `/api/spas/${spaId}/branches/${branchId}/clients/${client?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          birthday: data.birthday
            ? new Date(data.birthday).toISOString()
            : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el cliente');
      }

      // Close modal and refresh page
      onClose();
      router.refresh();
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
      title={mode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
      size="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="md:col-span-2">
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Nombre completo del cliente"
              error={form.formState.errors.name?.message}
            />
          </div>

          {/* Document Type */}
          <div>
            <Label htmlFor="documentType">Tipo de Documento *</Label>
            <Controller
              name="documentType"
              control={form.control}
              render={({ field }) => (
                <Select
                  id="documentType"
                  value={field.value}
                  onChange={field.onChange}
                  error={form.formState.errors.documentType?.message}
                >
                  {DOCUMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              )}
            />
          </div>

          {/* Document Number */}
          <div>
            <Label htmlFor="documentNumber">Número de Documento *</Label>
            <Input
              id="documentNumber"
              {...form.register('documentNumber')}
              placeholder="Número de documento"
              error={form.formState.errors.documentNumber?.message}
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              {...form.register('phone')}
              placeholder="Ej: 3001234567"
              error={form.formState.errors.phone?.message}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="correo@ejemplo.com"
              error={form.formState.errors.email?.message}
            />
          </div>

          {/* Birthday */}
          <div>
            <Label htmlFor="birthday">Fecha de Nacimiento</Label>
            <Input
              id="birthday"
              type="date"
              {...form.register('birthday')}
              error={form.formState.errors.birthday?.message}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            {...form.register('notes')}
            placeholder="Notas adicionales sobre el cliente..."
            rows={3}
            error={form.formState.errors.notes?.message}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting
              ? 'Guardando...'
              : mode === 'create'
                ? 'Crear Cliente'
                : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
