'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';
import { createSpa, updateSpa } from '../actions';

// Validation schema
const spaSchema = z.object({
  name: z.string().min(1, 'El nombre del spa es requerido'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(
      /^[a-z0-9-]+$/,
      'El slug solo puede contener letras minúsculas, números y guiones'
    ),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  openingTime: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Formato de hora inválido (HH:MM)'
    )
    .optional()
    .or(z.literal('')),
  closingTime: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Formato de hora inválido (HH:MM)'
    )
    .optional()
    .or(z.literal('')),
  isActive: z.boolean(),
});

type SpaFormData = z.infer<typeof spaSchema>;

interface SpaModalProps {
  isOpen: boolean;
  onClose: () => void;
  spa?: {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    openingTime: string | null;
    closingTime: string | null;
    isActive: boolean;
  };
}

export function SpaModal({ isOpen, onClose, spa }: SpaModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!spa;

  const form = useForm<SpaFormData>({
    resolver: zodResolver(spaSchema),
    defaultValues: {
      name: '',
      slug: '',
      address: '',
      phone: '',
      email: '',
      openingTime: '',
      closingTime: '',
      isActive: true,
    },
  });

  // Reset form when spa prop changes (for edit mode)
  useEffect(() => {
    if (spa) {
      form.reset({
        name: spa.name,
        slug: spa.slug,
        address: spa.address || '',
        phone: spa.phone || '',
        email: spa.email || '',
        openingTime: spa.openingTime || '',
        closingTime: spa.closingTime || '',
        isActive: spa.isActive,
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        address: '',
        phone: '',
        email: '',
        openingTime: '',
        closingTime: '',
        isActive: true,
      });
    }
  }, [spa, form]);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();

    form.setValue('slug', slug);
  };

  const onSubmit = async (data: SpaFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      if (data.address) formData.append('address', data.address);
      if (data.phone) formData.append('phone', data.phone);
      if (data.email) formData.append('email', data.email);
      if (data.openingTime) formData.append('openingTime', data.openingTime);
      if (data.closingTime) formData.append('closingTime', data.closingTime);
      formData.append('isActive', data.isActive.toString());

      if (isEditing && spa) {
        formData.append('id', spa.id);
        const result = await updateSpa(spa.id, formData);
        if (!result.success) {
          setError(result.error || 'Error al actualizar spa');
          return;
        }
      } else {
        const result = await createSpa(formData);
        if (!result.success) {
          setError(result.error || 'Error al crear spa');
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
      title={isEditing ? 'Editar Spa' : 'Crear Nuevo Spa'}
      className="max-w-2xl"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="md:col-span-2">
            <Label htmlFor="name">Nombre del Spa *</Label>
            <Input
              id="name"
              {...form.register('name')}
              onChange={handleNameChange}
              placeholder="Ej: Spa de Uñas Centro"
              error={form.formState.errors.name?.message}
            />
          </div>

          {/* Slug */}
          <div className="md:col-span-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              {...form.register('slug')}
              placeholder="ej: spa-de-unas-centro"
              error={form.formState.errors.slug?.message}
            />
            <p className="text-xs text-gray-500 mt-1">
              URL amigable para el spa (solo letras minúsculas, números y
              guiones)
            </p>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              {...form.register('address')}
              placeholder="Dirección completa del spa"
              error={form.formState.errors.address?.message}
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              {...form.register('phone')}
              placeholder="+57 300 123 4567"
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
              placeholder="contacto@spa.com"
              error={form.formState.errors.email?.message}
            />
          </div>

          {/* Opening Time */}
          <div>
            <Label htmlFor="openingTime">Hora de Apertura</Label>
            <Input
              id="openingTime"
              type="time"
              {...form.register('openingTime')}
              error={form.formState.errors.openingTime?.message}
            />
          </div>

          {/* Closing Time */}
          <div>
            <Label htmlFor="closingTime">Hora de Cierre</Label>
            <Input
              id="closingTime"
              type="time"
              {...form.register('closingTime')}
              error={form.formState.errors.closingTime?.message}
            />
          </div>

          {/* Active Status */}
          <div className="md:col-span-2 flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={form.watch('isActive')}
              onCheckedChange={checked => form.setValue('isActive', checked)}
            />
            <Label htmlFor="isActive">Spa activo</Label>
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
              : (isEditing ? 'Actualizar' : 'Crear') + ' Spa'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
