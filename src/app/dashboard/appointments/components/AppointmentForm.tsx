'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Select, Button, Textarea, SearchSelect, useNotifications } from '@/components/ui'
import { appointmentFormSchema, type AppointmentFormData } from '../schemas'
import type { Appointment } from '../types'

interface Option {
  id: string
  name: string
}

interface AppointmentFormProps {
  appointment?: Appointment
  clients: Option[]
  manicurists: Option[]
  services: Option[]
  onSubmit: (data: AppointmentFormData) => Promise<void>
  onCreateClient?: (initialName?: string, setValue?: (name: keyof AppointmentFormData, value: string | number | Date) => void) => void
  isSubmitting?: boolean
}

function mapAppointmentToFormData(appointment: Appointment, manicurists: Option[], services: Option[]): AppointmentFormData {
  return {
    clientId: appointment.clientId,
    manicuristId: String(appointment.manicuristId || '') !== ''
      ? String(appointment.manicuristId)
      : (manicurists.length > 0 ? manicurists[0].id : ''),
    serviceType: String(appointment.serviceType || '') !== ''
      ? String(appointment.serviceType)
      : (services.length > 0 ? services[0].id : ''),
    scheduledAt: appointment.scheduledAt,
    duration: appointment.duration,
    price: appointment.price,
    status: (['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as readonly AppointmentFormData['status'][]).includes(appointment.status as AppointmentFormData['status'])
      ? appointment.status as AppointmentFormData['status']
      : 'SCHEDULED',
    notes: appointment.notes ?? '',
  }
}

export function AppointmentForm({ appointment, clients, manicurists, services, onSubmit, onCreateClient, isSubmitting }: AppointmentFormProps) {
  const { showSuccess, showError } = useNotifications()
  const defaultValues: AppointmentFormData = appointment
    ? mapAppointmentToFormData(appointment, manicurists, services)
    : {
        clientId: '',
        manicuristId: manicurists.length > 0 ? manicurists[0].id : '',
        serviceType: services.length > 0 ? services[0].id : '',
        scheduledAt: new Date(),
        duration: 30,
        price: 0,
        status: 'SCHEDULED',
        notes: ''
      }
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues
  })

  const clientId = watch('clientId')
  const manicuristId = watch('manicuristId')
  const serviceType = watch('serviceType')
  const status = watch('status')

  const onSubmitForm = async (data: AppointmentFormData) => {
    try {
      await onSubmit(data)
      showSuccess(
        appointment ? 'Cita actualizada' : 'Cita creada',
        appointment
          ? 'Los datos de la cita han sido actualizados exitosamente.'
          : 'La cita ha sido creada exitosamente.'
      )
    } catch {
      showError(
        'Error al guardar',
        'Ocurrió un error al guardar los datos de la cita. Por favor, intenta de nuevo.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <SearchSelect
        label="Cliente"
        options={clients}
        value={clientId || ''}
        onChange={(value) => setValue('clientId', value)}
        onCreateNew={() => onCreateClient?.(undefined, setValue)}
        error={errors.clientId?.message}
        placeholder="Selecciona un cliente..."
      />
      <Select
        label="Manicurista"
        {...register('manicuristId')}
        value={manicuristId}
        error={errors.manicuristId?.message}
      >
        <option value="">Selecciona...</option>
        {manicurists.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </Select>
      <Select
        label="Servicio"
        {...register('serviceType')}
        value={serviceType}
        error={errors.serviceType?.message}
      >
        <option value="">Selecciona...</option>
        {services.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </Select>
      <Input
        label="Fecha y hora"
        type="datetime-local"
        {...register('scheduledAt', { valueAsDate: true })}
        error={errors.scheduledAt?.message}
      />
      <Input
        label="Duración (minutos)"
        type="number"
        min={1}
        step={1}
        {...register('duration', { valueAsNumber: true })}
        error={errors.duration?.message}
      />
      <Input
        label="Precio"
        type="number"
        min={1}
        step={100}
        {...register('price', { valueAsNumber: true })}
        error={errors.price?.message}
      />
      <Select
        label="Estado"
        {...register('status')}
        value={status}
        error={errors.status?.message}
      >
        <option value="SCHEDULED">Pendiente</option>
        <option value="CONFIRMED">Confirmada</option>
        <option value="COMPLETED">Completada</option>
        <option value="CANCELLED">Cancelada</option>
      </Select>
      <Textarea
        label="Notas"
        {...register('notes')}
        error={errors.notes?.message}
      />
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : appointment ? 'Actualizar Cita' : 'Crear Cita'}
        </Button>
      </div>
    </form>
  )
}
