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
      price: 0,
      kitCost: 0,
      taxRate: 0,
      duration: 30,
      recommendedReturnDays: 7,
      type: 'MANICURE_PEDICURE',
      imageUrl: '',
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
        imageUrl: service.imageUrl || '',
      };
      form.reset(formData);
    } else {
      const defaultData: CreateServiceData = {
        name: '',
        description: '',
        price: 0,
        kitCost: 0,
        taxRate: 0,
        duration: 30,
        recommendedReturnDays: 7,
        type: 'MANICURE_PEDICURE',
        imageUrl: '',
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
      formId={formId}
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
        className="space-y-4"
      >
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

        {/* Tipo de servicio */}
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

        {/* Precio */}
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
          {form.watch('price') > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {formatCurrency(form.watch('price'))}
            </p>
          )}
        </div>

        {/* Costo del kit */}
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
          {form.watch('kitCost') && Number(form.watch('kitCost')) > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {formatCurrency(Number(form.watch('kitCost')))}
            </p>
          )}
        </div>

        {/* Impuesto */}
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
          {form.watch('taxRate') && Number(form.watch('taxRate')) > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {Number(form.watch('taxRate'))}% (IVA)
            </p>
          )}
        </div>

        {/* Duración */}
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
          {form.watch('duration') > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {formatDuration(form.watch('duration'))}
            </p>
          )}
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
          {form.watch('recommendedReturnDays') &&
            Number(form.watch('recommendedReturnDays')) > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {Number(form.watch('recommendedReturnDays'))} días
              </p>
            )}
        </div>

        {/* URL de imagen */}
        <div>
          <Label htmlFor="imageUrl">URL de Imagen</Label>
          <Input
            id="imageUrl"
            type="url"
            {...form.register('imageUrl')}
            placeholder="https://ejemplo.com/imagen.jpg"
            error={form.formState.errors.imageUrl?.message}
          />
        </div>
      </form>
    </Modal>
  );
}
