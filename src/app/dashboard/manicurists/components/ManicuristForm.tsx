'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Select, Button, useNotifications } from '@/components/ui'
import { manicuristFormSchema, type ManicuristFormData } from '../schemas'
import { Manicurist } from '../types'

const SPECIALTY_OPTIONS = [
  { value: 'MANICURE', label: 'Manicure' },
  { value: 'PEDICURE', label: 'Pedicure' },
  { value: 'NAIL_ART', label: 'Nail Art' },
  { value: 'GEL_POLISH', label: 'Esmalte en Gel' },
  { value: 'ACRYLIC_NAILS', label: 'Uñas Acrílicas' },
]

interface ManicuristFormProps {
  manicurist?: Manicurist
  onSubmit: (data: ManicuristFormData) => Promise<void>
  isSubmitting?: boolean
}

export function ManicuristForm({ manicurist, onSubmit, isSubmitting }: ManicuristFormProps) {
  const { showSuccess, showError } = useNotifications()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ManicuristFormData>({
    resolver: zodResolver(manicuristFormSchema),
    defaultValues: manicurist ? {
      name: manicurist.name,
      email: manicurist.email || '',
      phone: manicurist.phone || '',
      specialty: manicurist.specialty || '',
      commission: manicurist.commission,
      isActive: manicurist.isActive,
    } : {
      name: '',
      email: '',
      phone: '',
      specialty: '',
      commission: 50,
      isActive: true,
    }
  })

  const onSubmitForm = async (data: ManicuristFormData) => {
    try {
      await onSubmit(data)
      showSuccess(
        manicurist ? 'Manicurista actualizada' : 'Manicurista creada',
        manicurist
          ? 'Los datos de la manicurista han sido actualizados exitosamente.'
          : 'La manicurista ha sido creada exitosamente.'
      )
    } catch {
      showError(
        'Error',
        'Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.'
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

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Teléfono"
        {...register('phone')}
        error={errors.phone?.message}
      />

      <Controller
        name="specialty"
        control={control}
        render={({ field }) => (
          <Select
            label="Especialidad"
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.specialty?.message}
          >
            <option value="">Seleccionar especialidad</option>
            {SPECIALTY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      />

      <Input
        label="Comisión (%)"
        type="number"
        min="0"
        max="100"
        {...register('commission', { valueAsNumber: true })}
        error={errors.commission?.message}
      />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <Select
            label="Estado"
            value={field.value ? 'true' : 'false'}
            onChange={(e) => field.onChange(e.target.value === 'true')}
            error={errors.isActive?.message}
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </Select>
        )}
      />

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : manicurist ? 'Actualizar' : 'Crear'} Manicurista
        </Button>
      </div>
    </form>
  )
}
