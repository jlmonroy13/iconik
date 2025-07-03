'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Button, useNotifications } from '@/components/ui'
import { clientFormSchema, type ClientFormData } from '../schemas'
import type { Client } from '../types'

interface ClientFormProps {
  client?: Client
  onSubmit: (data: ClientFormData) => Promise<void>
  isSubmitting?: boolean
}

function getClientFormDefaultValues(client?: Client): ClientFormData {
  return {
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    birthday: client?.birthday,
    notes: client?.notes || '',
  }
}

export function ClientForm({ client, onSubmit, isSubmitting }: ClientFormProps) {
  const { showSuccess, showError } = useNotifications()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: getClientFormDefaultValues(client)
  })

  const onSubmitForm = async (data: ClientFormData) => {
    try {
      await onSubmit(data)
      showSuccess(
        client ? 'Cliente actualizado' : 'Cliente creado',
        client
          ? 'Los datos del cliente han sido actualizados exitosamente.'
          : 'El cliente ha sido creado exitosamente.'
      )
    } catch {
      showError(
        'Error al guardar',
        'Ocurrió un error al guardar los datos del cliente. Por favor, intenta de nuevo.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <Input
        label="Nombre"
        {...register("name")}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <Input
        label="Teléfono"
        {...register("phone")}
        error={errors.phone?.message}
      />
      <Input
        label="Fecha de Nacimiento"
        type="date"
        {...register("birthday")}
        error={errors.birthday?.message}
      />
      <Input
        label="Notas"
        {...register("notes")}
        error={errors.notes?.message}
      />

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : client
            ? "Actualizar Cliente"
            : "Crear Cliente"}
        </Button>
      </div>
    </form>
  );
}
