'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import Switch from '@/components/ui/Switch';
import { createBranch, updateBranch } from '../actions';
import { createBranchSchema } from '@/types/forms';
import type { CreateBranchData } from '@/types/forms';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaId: string;
  branch?: {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    address: string;
    phone?: string | null;
    email?: string | null;
    openingTime?: string | null;
    closingTime?: string | null;
    isActive: boolean;
    isMain: boolean;
    invoicePrefix?: string | null;
  };
}

export function BranchModal({
  isOpen,
  onClose,
  spaId,
  branch,
}: BranchModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      openingTime: '',
      closingTime: '',
      isActive: true,
      isMain: false,
      invoicePrefix: '',
    } as CreateBranchData,
  });

  // Reset form when branch prop changes (for editing)
  useEffect(() => {
    if (branch) {
      form.reset({
        name: branch.name || '',
        code: branch.code || '',
        description: branch.description || '',
        address: branch.address || '',
        phone: branch.phone || '',
        email: branch.email || '',
        openingTime: branch.openingTime || '',
        closingTime: branch.closingTime || '',
        isActive: branch.isActive ?? true,
        isMain: branch.isMain ?? false,
        invoicePrefix: branch.invoicePrefix || '',
      });
    } else {
      // Reset to empty values for creating new branch
      form.reset({
        name: '',
        code: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        openingTime: '',
        closingTime: '',
        isActive: true,
        isMain: false,
        invoicePrefix: '',
      });
    }
  }, [branch, form]);

  const onSubmit = async (data: CreateBranchData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = branch
        ? await updateBranch(branch.id, data)
        : await createBranch(spaId, data);

      if (result.success) {
        onClose();
        form.reset();
      } else {
        setError(result.error || 'Error al procesar la solicitud');
      }
    } catch (_err) {
      setError('Error inesperado al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      form.reset();
      setError(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={branch ? 'Editar Sede' : 'Crear Nueva Sede'}
      size="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre de la Sede *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Ej: Sede Centro"
              error={form.formState.errors.name?.message}
            />
          </div>

          <div>
            <Label htmlFor="code">Código *</Label>
            <Input
              id="code"
              {...form.register('code')}
              placeholder="Ej: CENTRO"
              error={form.formState.errors.code?.message}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            {...form.register('description')}
            placeholder="Descripción opcional de la sede"
            rows={3}
            error={form.formState.errors.description?.message}
          />
        </div>

        <div>
          <Label htmlFor="address">Dirección *</Label>
          <Input
            id="address"
            {...form.register('address')}
            placeholder="Dirección completa de la sede"
            error={form.formState.errors.address?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              {...form.register('phone')}
              placeholder="Ej: +57 300 123 4567"
              error={form.formState.errors.phone?.message}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="Ej: sede@spa.com"
              error={form.formState.errors.email?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="openingTime">Hora de Apertura</Label>
            <Input
              id="openingTime"
              type="time"
              {...form.register('openingTime')}
              error={form.formState.errors.openingTime?.message}
            />
          </div>

          <div>
            <Label htmlFor="closingTime">Hora de Cierre</Label>
            <Input
              id="closingTime"
              type="time"
              {...form.register('closingTime')}
              error={form.formState.errors.closingTime?.message}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="invoicePrefix">Prefijo de Factura</Label>
          <Input
            id="invoicePrefix"
            {...form.register('invoicePrefix')}
            placeholder="Ej: CENTRO-"
            error={form.formState.errors.invoicePrefix?.message}
          />
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={form.watch('isActive') ?? false}
              onCheckedChange={checked => form.setValue('isActive', checked)}
            />
            <Label htmlFor="isActive">Sede Activa</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isMain"
              checked={form.watch('isMain') ?? false}
              onCheckedChange={checked => form.setValue('isMain', checked)}
            />
            <Label htmlFor="isMain">Sede Principal</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Guardando...'
              : branch
                ? 'Actualizar Sede'
                : 'Crear Sede'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
