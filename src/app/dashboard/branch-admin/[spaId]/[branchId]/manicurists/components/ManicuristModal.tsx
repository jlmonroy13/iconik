'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui';
import {
  createManicuristSchema,
  type CreateManicuristData,
} from '@/types/forms';
import { createManicurist, updateManicurist } from '../actions';
import type { ManicuristWithCounts } from '@/types/manicurists';

interface ManicuristModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaId: string;
  branchId: string;
  mode: 'create' | 'edit';
  manicurist?: ManicuristWithCounts | null;
}

export function ManicuristModal({
  isOpen,
  onClose,
  spaId,
  branchId,
  mode,
  manicurist,
}: ManicuristModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateManicuristData>({
    resolver: zodResolver(createManicuristSchema),
    defaultValues: {
      name: '',
      phone: undefined,
      email: undefined,
      commission: 0.5,
      isActive: true,
    },
  });

  // Reset form when modal opens/closes or manicurist changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && manicurist) {
        form.reset({
          name: manicurist.name,
          phone: manicurist.phone || undefined,
          email: manicurist.email || undefined,
          commission: manicurist.commission,
          isActive: manicurist.isActive,
        });
      } else {
        form.reset({
          name: '',
          phone: undefined,
          email: undefined,
          commission: 0.5,
          isActive: true,
        });
      }
      setError(null);
    }
  }, [isOpen, mode, manicurist, form]);

  const onSubmit = async (data: CreateManicuristData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result =
        mode === 'create'
          ? await createManicurist(spaId, branchId, data)
          : await updateManicurist(manicurist!.id, spaId, branchId, data);

      if (result.success) {
        router.refresh();
        onClose();
      } else {
        setError(result.error || 'Error al guardar manicurista');
      }
    } catch (err) {
      setError('Error inesperado al guardar manicurista');
      console.error('Error submitting manicurist:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Nueva Manicurista' : 'Editar Manicurista'}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Name */}
        <div>
          <Label htmlFor="name">
            Nombre Completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Ej: María García"
            disabled={isSubmitting}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            {...form.register('phone')}
            placeholder="Ej: +57 300 123 4567"
            disabled={isSubmitting}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email (opcional)</Label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="Ej: maria@example.com"
            disabled={isSubmitting}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Commission */}
        <div>
          <Label htmlFor="commission">
            Porcentaje de Comisión <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Controller
              name="commission"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                  disabled={isSubmitting}
                  className="flex-1"
                />
              )}
            />
            <span className="text-sm text-gray-500">
              {Math.round((form.watch('commission') || 0) * 100)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ingresa un valor entre 0 y 1 (ej: 0.5 para 50%)
          </p>
          {form.formState.errors.commission && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.commission.message}
            </p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center justify-between">
          <Label htmlFor="isActive">Manicurista Activa</Label>
          <Controller
            name="isActive"
            control={form.control}
            render={({ field }) => (
              <Switch
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
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
                ? 'Crear Manicurista'
                : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
