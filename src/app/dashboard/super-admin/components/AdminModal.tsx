'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { createAdmin, updateAdmin } from '../actions';

// Validation schema
const adminSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  role: z.enum(['SPA_ADMIN', 'SUPER_ADMIN']),
  spaId: z.string().optional(),
  isActive: z.boolean(),
});

type AdminFormData = z.infer<typeof adminSchema>;

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  spas: Array<{ id: string; name: string; slug: string }>;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: 'SPA_ADMIN' | 'SUPER_ADMIN';
    spaId: string | null;
    isActive: boolean;
  };
}

export function AdminModal({ isOpen, onClose, spas, user }: AdminModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!user;

  const form = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'SPA_ADMIN',
      spaId: '',
      isActive: true,
    },
  });

  const selectedRole = form.watch('role');

  // Reset form when user prop changes (for edit mode)
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email,
        role: user.role,
        spaId: user.spaId || '',
        isActive: user.isActive,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        role: 'SPA_ADMIN',
        spaId: '',
        isActive: true,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: AdminFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('role', data.role);
      if (data.spaId) {
        formData.append('spaId', data.spaId);
      }
      formData.append('isActive', data.isActive.toString());

      if (isEditing && user) {
        const result = await updateAdmin(user.id, formData);
        if (!result.success) {
          setError(result.error || 'Error al actualizar administrador');
          return;
        }
      } else {
        const result = await createAdmin(formData);
        if (!result.success) {
          setError(result.error || 'Error al crear administrador');
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
      title={isEditing ? 'Editar Administrador' : 'Crear Administrador'}
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
              placeholder="Nombre completo del administrador"
              error={form.formState.errors.name?.message}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="admin@ejemplo.com"
              error={form.formState.errors.email?.message}
            />
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">Rol *</Label>
            <Select
              id="role"
              value={form.watch('role')}
              onChange={e =>
                form.setValue(
                  'role',
                  e.target.value as 'SPA_ADMIN' | 'SUPER_ADMIN'
                )
              }
              error={form.formState.errors.role?.message}
            >
              <option value="">Seleccionar rol</option>
              <option value="SPA_ADMIN">Administrador de Spa</option>
              <option value="SUPER_ADMIN">Super Administrador</option>
            </Select>
          </div>

          {/* Spa Selection (only for SPA_ADMIN) */}
          {selectedRole === 'SPA_ADMIN' && (
            <div>
              <Label htmlFor="spaId">Spa *</Label>
              <Select
                id="spaId"
                value={form.watch('spaId') || ''}
                onChange={e =>
                  form.setValue('spaId', e.target.value || undefined)
                }
                error={form.formState.errors.spaId?.message}
              >
                <option value="">Seleccionar spa</option>
                {spas.map(spa => (
                  <option key={spa.id} value={spa.id}>
                    {spa.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={form.watch('isActive')}
              onCheckedChange={checked => form.setValue('isActive', checked)}
            />
            <Label htmlFor="isActive">Administrador activo</Label>
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
              : (isEditing ? 'Actualizar' : 'Crear') + ' Administrador'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
