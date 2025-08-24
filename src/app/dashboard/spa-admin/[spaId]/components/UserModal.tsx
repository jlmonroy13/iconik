'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import { createUser, updateUser } from '../actions';
import { createUserSchema } from '@/types/forms';
import type { z } from 'zod';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaId: string;
  branches: {
    id: string;
    name: string;
    code: string;
  }[];
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: 'BRANCH_ADMIN' | 'MANICURIST';
    branchId: string | null;
    isActive: boolean;
  };
  userType: 'BRANCH_ADMIN' | 'MANICURIST';
}

export function UserModal({
  isOpen,
  onClose,
  spaId,
  branches,
  user,
  userType,
}: UserModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!user;
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: userType,
      spaId: spaId,
      branchId: '',
      isActive: true,
    },
  });

  // Reset form when user prop changes (for editing)
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        role: user.role || userType,
        spaId: spaId,
        branchId: user.branchId || '',
        isActive: user.isActive ?? true,
      });
    } else {
      // Reset to empty values for creating new user
      form.reset({
        name: '',
        email: '',
        role: userType,
        spaId: spaId,
        branchId: '',
        isActive: true,
      });
    }
  }, [user, userType, spaId, form]);

  const onSubmit = async (data: z.infer<typeof createUserSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditing) {
        const result = await updateUser(user!.id, data);
        if (result.success) {
          onClose();
          form.reset();
        } else {
          setError(result.error || 'Error al actualizar usuario');
        }
      } else {
        const result = await createUser(spaId, data);
        if (result.success) {
          onClose();
          form.reset();
        } else {
          setError(result.error || 'Error al crear usuario');
        }
      }
    } catch (_err) {
      setError('Error inesperado al procesar la solicitud');
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
      title={
        isEditing
          ? `Editar ${userType === 'BRANCH_ADMIN' ? 'Administrador' : 'Manicurista'}`
          : `Crear ${userType === 'BRANCH_ADMIN' ? 'Administrador' : 'Manicurista'}`
      }
      description={
        isEditing
          ? `Modifica la información del ${userType === 'BRANCH_ADMIN' ? 'administrador' : 'manicurista'}`
          : `Crea un nuevo ${userType === 'BRANCH_ADMIN' ? 'administrador' : 'manicurista'} para el spa`
      }
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
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Ej: Juan Pérez"
              error={form.formState.errors.name?.message}
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="Ej: juan@spa.com"
              error={form.formState.errors.email?.message}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="role">Rol</Label>
          <Select
            id="role"
            value={form.watch('role')}
            onChange={e =>
              form.setValue(
                'role',
                e.target.value as 'BRANCH_ADMIN' | 'MANICURIST'
              )
            }
            disabled={isEditing}
          >
            <option value="BRANCH_ADMIN">Administrador de Sede</option>
            <option value="MANICURIST">Manicurista</option>
          </Select>
          {form.formState.errors.role?.message && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.role.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="branchId">
            Sede Asignada {form.watch('role') === 'BRANCH_ADMIN' ? '*' : ''}
          </Label>
          <Select
            id="branchId"
            value={form.watch('branchId') || ''}
            onChange={e => form.setValue('branchId', e.target.value)}
          >
            <option value="">Seleccionar sede</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name} ({branch.code})
              </option>
            ))}
          </Select>
          {form.formState.errors.branchId?.message && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.branchId.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={form.watch('isActive') ?? false}
            onCheckedChange={checked => form.setValue('isActive', checked)}
          />
          <Label htmlFor="isActive">Usuario Activo</Label>
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? 'Guardando...'
                : 'Creando...'
              : isEditing
                ? 'Guardar Cambios'
                : `Crear ${userType === 'BRANCH_ADMIN' ? 'Administrador' : 'Manicurista'}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
