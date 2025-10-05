'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { createServiceSchema, type CreateServiceData } from '@/types/forms';
import { SERVICE_TYPES } from '@/types/services';
import type { ServiceWithBranch } from '@/types/services';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateServiceData) => Promise<void>;
  service?: ServiceWithBranch | null;
  isLoading?: boolean;
}

export function ServiceModal({
  isOpen,
  onClose,
  onSubmit,
  service,
  isLoading = false,
}: ServiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateServiceData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      kitCost: undefined,
      taxRate: undefined,
      duration: undefined,
      recommendedReturnDays: undefined,
      type: 'MANICURE_PEDICURE',
      image: '',
    },
  });

  // Reset form when service changes
  useEffect(() => {
    if (service) {
      const formData = {
        name: service.name,
        description: service.description || '',
        price: service.price,
        kitCost: service.kitCost || 0,
        taxRate: service.taxRate || 0,
        duration: service.duration,
        recommendedReturnDays: service.recommendedReturnDays || 7,
        type: service.type,
        image: service.image || '',
      };
      form.reset(formData);
    } else {
      const defaultData: CreateServiceData = {
        name: '',
        description: '',
        price: undefined,
        kitCost: undefined,
        taxRate: undefined,
        duration: undefined,
        recommendedReturnDays: undefined,
        type: 'MANICURE_PEDICURE',
        image: '',
      };
      form.reset(defaultData);
    }
  }, [service, form]);

  const handleSubmit = async (data: CreateServiceData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      onClose();
      form.reset();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('ServiceModal handleSubmit error:', error);
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}min` : ''}`.trim();
    }
    return `${mins}min`;
  };

  const formId = 'service-form';

  // Helper function to check if a value is a valid positive number
  const isValidPositiveNumber = (value: unknown): boolean => {
    if (value === null || value === undefined || value === '') return false;
    const num = Number(value);
    return !isNaN(num) && num > 0;
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
      formId={formId}
      size="xl"
      className="w-[80vw] max-w-7xl"
      footer={
        <div className="flex justify-end space-x-2">
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
            form={formId}
            disabled={isSubmitting || isLoading}
          >
            {service ? 'Actualizar' : 'Crear'} Servicio
          </Button>
        </div>
      }
    >
      <form
        id={formId}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        {/* Layout de dos columnas principales */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Columna Izquierda - Solo Imagen */}
          <div>
            <Label>Imagen del Servicio</Label>
            <ImageUpload
              value={form.watch('image')}
              onChange={base64 => form.setValue('image', base64 || '')}
              maxSizeMB={2}
              className="mt-2"
            />
            {form.formState.errors.image?.message && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {form.formState.errors.image.message}
              </p>
            )}
          </div>

          {/* Columna Derecha - Todos los demás campos */}
          <div className="space-y-4">
            {/* Nombre del servicio */}
            <div>
              <Label htmlFor="name">Nombre del Servicio *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Ej: Manicure tradicional"
                error={form.formState.errors.name?.message}
              />
            </div>

            {/* Tipo de servicio y Duración */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo de Servicio *</Label>
                <Select
                  id="type"
                  {...form.register('type')}
                  error={form.formState.errors.type?.message}
                >
                  <option value="">Seleccionar tipo</option>
                  {SERVICE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duración (minutos) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  {...form.register('duration', { valueAsNumber: true })}
                  placeholder="45"
                  error={form.formState.errors.duration?.message}
                />
                {isValidPositiveNumber(form.watch('duration')) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formatDuration(Number(form.watch('duration')))}
                  </p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Descripción detallada del servicio"
                rows={3}
                error={form.formState.errors.description?.message}
              />
            </div>

            {/* Información de Precios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Precio (COP) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1000"
                  {...form.register('price', { valueAsNumber: true })}
                  placeholder="18000"
                  error={form.formState.errors.price?.message}
                />
                {isValidPositiveNumber(form.watch('price')) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formatCurrency(Number(form.watch('price')))}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="kitCost">Costo del Kit (COP)</Label>
                <Input
                  id="kitCost"
                  type="number"
                  min="0"
                  step="1000"
                  {...form.register('kitCost', { valueAsNumber: true })}
                  placeholder="5000"
                  error={form.formState.errors.kitCost?.message}
                />
                {isValidPositiveNumber(form.watch('kitCost')) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formatCurrency(Number(form.watch('kitCost')))}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="taxRate">Impuesto (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  {...form.register('taxRate', { valueAsNumber: true })}
                  placeholder="19"
                  error={form.formState.errors.taxRate?.message}
                />
                {isValidPositiveNumber(form.watch('taxRate')) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {Number(form.watch('taxRate'))}% (IVA)
                  </p>
                )}
              </div>
            </div>

            {/* Días de retorno recomendados */}
            <div>
              <Label htmlFor="recommendedReturnDays">
                Días de Retorno Recomendados
              </Label>
              <Input
                id="recommendedReturnDays"
                type="number"
                min="1"
                {...form.register('recommendedReturnDays', {
                  valueAsNumber: true,
                })}
                placeholder="7"
                error={form.formState.errors.recommendedReturnDays?.message}
              />
              {isValidPositiveNumber(form.watch('recommendedReturnDays')) && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {Number(form.watch('recommendedReturnDays'))} días
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
