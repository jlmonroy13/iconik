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
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service || { status: 'ACTIVE' }
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
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
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
        label="Categoría"
        {...register('category')}
        error={errors.category?.message}
      >
        <option value="">Selecciona...</option>
        <option value="MANOS">Manos</option>
        <option value="PIES">Pies</option>
        <option value="DEPILACION">Depilación</option>
        <option value="OTRO">Otro</option>
      </Select>
      <Select
        label="Estado"
        {...register('status')}
        error={errors.status?.message}
      >
        <option value="ACTIVE">Activo</option>
        <option value="INACTIVE">Inactivo</option>
      </Select>
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : service ? 'Actualizar Servicio' : 'Crear Servicio'}
        </Button>
      </div>
    </form>
  )
}
