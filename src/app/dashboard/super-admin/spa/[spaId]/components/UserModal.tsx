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
import { createUser, updateUser } from '../actions';
import { UserRole } from '@/generated/prisma';

// Validation schema
const userSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  role: z.enum(['SPA_ADMIN', 'BRANCH_ADMIN', 'MANICURIST', 'CLIENT']),
  branchId: z.string().optional(),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaId: string;
  branches: Array<{ id: string; name: string; code: string }>;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: UserRole;
    branchId: string | null;
    isActive: boolean;
  };
}

export function UserModal({
  isOpen,
  onClose,
  spaId,
  branches,
  user,
}: UserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role:
        (user?.role === 'SUPER_ADMIN' ? 'SPA_ADMIN' : user?.role) || 'CLIENT',
      branchId: user?.branchId || undefined,
      isActive: user?.isActive ?? true,
    },
  });

  const selectedRole = form.watch('role');

  // Reset form when user prop changes (for edit mode)
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email,
        role:
          (user.role === 'SUPER_ADMIN' ? 'SPA_ADMIN' : user.role) || 'CLIENT',
        branchId: user.branchId || undefined,
        isActive: user.isActive,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        role: 'CLIENT',
        branchId: undefined,
        isActive: true,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('role', data.role);
      if (data.branchId) {
        formData.append('branchId', data.branchId);
      }
      formData.append('isActive', data.isActive.toString());

      if (isEditing && user) {
        formData.append('id', user.id);
        const result = await updateUser(spaId, formData);
        if (!result.success) {
          setError(result.error || 'Error al actualizar usuario');
          return;
        }
      } else {
        const result = await createUser(spaId, formData);
        if (!result.success) {
          setError(result.error || 'Error al crear usuario');
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
      title={isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
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
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Nombre completo del usuario"
              error={form.formState.errors.name?.message}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="usuario@ejemplo.com"
              error={form.formState.errors.email?.message}
            />
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">Rol</Label>
            <Select
              id="role"
              value={form.watch('role')}
              onChange={e =>
                form.setValue(
                  'role',
                  e.target.value as
                    | 'SPA_ADMIN'
                    | 'BRANCH_ADMIN'
                    | 'MANICURIST'
                    | 'CLIENT'
                )
              }
              error={form.formState.errors.role?.message}
            >
              <option value="">Seleccionar rol</option>
              <option value="SPA_ADMIN">Admin de Spa</option>
              <option value="BRANCH_ADMIN">Admin de Sede</option>
              <option value="MANICURIST">Manicurista</option>
              <option value="CLIENT">Cliente</option>
            </Select>
          </div>

          {/* Branch (only for BRANCH_ADMIN and MANICURIST) */}
          {(selectedRole === 'BRANCH_ADMIN' ||
            selectedRole === 'MANICURIST') && (
            <div>
              <Label htmlFor="branchId">Sede</Label>
              <Select
                id="branchId"
                value={form.watch('branchId') || ''}
                onChange={e =>
                  form.setValue('branchId', e.target.value || undefined)
                }
                error={form.formState.errors.branchId?.message}
              >
                <option value="">Seleccionar sede</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} ({branch.code})
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
            <Label htmlFor="isActive">Usuario activo</Label>
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
              : (isEditing ? 'Actualizar' : 'Crear') + ' Usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
