'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Select, Button, MultiSelect, useNotifications } from '@/components/ui'
import { manicuristFormSchema, type ManicuristFormData } from '../schemas'
import { Manicurist } from '../types'

const SERVICE_OPTIONS = [
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
      email: manicurist.email,
      phone: manicurist.phone,
      specialties: manicurist.specialties,
      status: manicurist.status,
      avatar: manicurist.avatar,
    } : {
      status: 'ACTIVE',
      specialties: [],
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
        name="specialties"
        control={control}
        render={({ field }) => (
          <MultiSelect
            label="Especialidades"
            options={SERVICE_OPTIONS}
            value={field.value}
            onChange={field.onChange}
            error={errors.specialties?.message}
          />
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select
            label="Estado"
            value={field.value}
            onChange={field.onChange}
            error={errors.status?.message}
          >
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
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
