'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import Switch from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { createBranch, updateBranch } from '../branch-actions';

// Validation schema
const branchSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().min(1, 'El código es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  isMain: z.boolean(),
});

type BranchFormData = z.infer<typeof branchSchema>;

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaId: string;
  branch?: {
    id: string;
    name: string;
    code: string;
    address: string;
    isMain: boolean;
  };
}

export function BranchModal({
  isOpen,
  onClose,
  spaId,
  branch,
}: BranchModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!branch;

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      code: '',
      address: '',
      isMain: false,
    },
  });

  // Reset form when branch prop changes (for edit mode)
  useEffect(() => {
    if (branch) {
      form.reset({
        name: branch.name,
        code: branch.code,
        address: branch.address,
        isMain: branch.isMain,
      });
    } else {
      form.reset({
        name: '',
        code: '',
        address: '',
        isMain: false,
      });
    }
  }, [branch, form]);

  const onSubmit = async (data: BranchFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('code', data.code);
      formData.append('address', data.address);
      formData.append('isMain', data.isMain.toString());

      if (isEditing && branch) {
        const result = await updateBranch(branch.id, formData);
        if (!result.success) {
          setError(result.error || 'Error al actualizar sede');
          return;
        }
      } else {
        const result = await createBranch(spaId, formData);
        if (!result.success) {
          setError(result.error || 'Error al crear sede');
          return;
        }
      }

      // Success - close modal and reset form
      onClose();
      form.reset();
    } catch (_error) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      form.reset();
      setError(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Editar Sede' : 'Crear Sede'}
      className="max-w-md"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Nombre de la sede"
              error={form.formState.errors.name?.message}
            />
          </div>

          {/* Code */}
          <div>
            <Label htmlFor="code">Código *</Label>
            <Input
              id="code"
              {...form.register('code')}
              placeholder="Código único de la sede"
              error={form.formState.errors.code?.message}
            />
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Dirección *</Label>
            <Textarea
              id="address"
              {...form.register('address')}
              placeholder="Dirección completa de la sede"
              error={form.formState.errors.address?.message}
              rows={3}
            />
          </div>

          {/* Main Branch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isMain"
              checked={form.watch('isMain')}
              onCheckedChange={checked => form.setValue('isMain', checked)}
            />
            <Label htmlFor="isMain">Sede principal</Label>
          </div>
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Guardando...'
              : (isEditing ? 'Actualizar' : 'Crear') + ' Sede'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
