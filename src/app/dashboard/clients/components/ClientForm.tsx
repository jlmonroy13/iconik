'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useNotifications } from '@/components/ui/NotificationContext'
import { Select } from '@/components/ui/Select'
import { clientFormSchema, type ClientFormData } from '../schemas'
import type { Client } from '../types'

const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' },
  { value: 'OTRO', label: 'Otro' },
]

interface ClientFormProps {
  client?: Client
  onSubmit: (data: ClientFormData) => Promise<void>
  isSubmitting?: boolean
}

function getClientFormDefaultValues(client?: Client): ClientFormData {
  return {
    name: client?.name || '',
    documentType: client?.documentType || '',
    documentNumber: client?.documentNumber || '',
    email: client?.email || '',
    phone: client?.phone || '',
    birthday: client?.birthday ? (typeof client.birthday === 'string' ? client.birthday : client.birthday.toISOString().slice(0, 10)) : '',
    notes: client?.notes || '',
  }
}

export function ClientForm({ client, onSubmit, isSubmitting }: ClientFormProps) {
  const { showSuccess, showError } = useNotifications()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: getClientFormDefaultValues(client)
  })

  const onSubmitForm = async (data: ClientFormData) => {
    try {
      const submitData = {
        ...data,
        birthday: data.birthday || undefined,
      }
      console.log('ClientForm submit data:', submitData)
      await onSubmit(submitData)
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
      <Controller
        name="documentType"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            label="Tipo de Documento"
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          >
            <option value="">Selecciona...</option>
            {DOCUMENT_TYPES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Select>
        )}
      />
      <Input
        label="Número de Documento"
        {...register("documentNumber")}
        error={errors.documentNumber?.message}
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
