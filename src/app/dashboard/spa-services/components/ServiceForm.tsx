'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Select, Button, useNotifications, Textarea } from '@/components/ui'
import { serviceFormSchema, type ServiceFormData } from '../schemas'
import type { Service } from '../types'

interface ServiceFormProps {
  service?: Service
  onSubmit: (data: ServiceFormData) => Promise<void>
  isSubmitting?: boolean
}

export function ServiceForm({ service, onSubmit, isSubmitting }: ServiceFormProps) {
  const { showSuccess, showError } = useNotifications()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema) as any,
    defaultValues: service || {
      isActive: true,
      kitCost: 0,
      taxRate: 0,
      imageUrl: ''
    }
  })

  const onSubmitForm = async (data: ServiceFormData) => {
    try {
      await onSubmit(data)
      showSuccess(
        service ? 'Servicio actualizado' : 'Servicio creado',
        service
          ? 'Los datos del servicio han sido actualizados exitosamente.'
          : 'El servicio ha sido creado exitosamente.'
      )
    } catch {
      showError(
        'Error al guardar',
        'Ocurrió un error al guardar los datos del servicio. Por favor, intenta de nuevo.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm) as any} className="space-y-4">
      <Input
        label="Nombre"
        {...register('name')}
        error={errors.name?.message}
      />
      <Textarea
        label="Descripción"
        {...register('description')}
        error={errors.description?.message}
      />
      <Input
        label="Precio"
        type="number"
        min={1}
        step={100}
        {...register('price', { valueAsNumber: true })}
        error={errors.price?.message}
      />
      <Input
        label="Duración (minutos)"
        type="number"
        min={1}
        step={1}
        {...register('duration', { valueAsNumber: true })}
        error={errors.duration?.message}
      />
      <Select
        label="Tipo de Servicio"
        {...register('type')}
        error={errors.type?.message}
      >
        <option value="">Selecciona...</option>
        <option value="MANICURE">Manicure</option>
        <option value="PEDICURE">Pedicure</option>
        <option value="NAIL_ART">Nail Art</option>
        <option value="GEL_POLISH">Esmalte en Gel</option>
        <option value="ACRYLIC_NAILS">Uñas Acrílicas</option>
        <option value="NAIL_REPAIR">Reparación de Uñas</option>
        <option value="HAND_SPA">Spa de Manos</option>
        <option value="FOOT_SPA">Spa de Pies</option>
        <option value="OTHER">Otro</option>
      </Select>
      <Input
        label="Costo del Kit (opcional)"
        type="number"
        min={0}
        step={100}
        {...register('kitCost', { valueAsNumber: true })}
        error={errors.kitCost?.message}
      />
      <Input
        label="Tasa de Impuesto (opcional, ej: 0.19 para 19%)"
        type="number"
        min={0}
        max={1}
        step={0.01}
        {...register('taxRate', { valueAsNumber: true })}
        error={errors.taxRate?.message}
      />
      <Input
        label="URL de Imagen (opcional)"
        type="url"
        {...register('imageUrl')}
        error={errors.imageUrl?.message}
      />
      <Select
        label="Estado"
        {...register('isActive')}
        error={errors.isActive?.message}
      >
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </Select>
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : service ? 'Actualizar Servicio' : 'Crear Servicio'}
        </Button>
      </div>
    </form>
  )
}
