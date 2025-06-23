import { z } from 'zod'

export const appointmentFormSchema = z.object({
  clientId: z.string().min(1, 'Selecciona un cliente'),
  manicuristId: z.string().min(1, 'Selecciona una manicurista').optional(),
  serviceType: z.string().min(1, 'Selecciona un servicio'),
  scheduledAt: z.coerce.date({ required_error: 'Selecciona la fecha y hora' }),
  duration: z.coerce.number().min(1, 'La duración debe ser mayor a 0'),
  price: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], { required_error: 'Selecciona un estado' }),
  notes: z.string().optional(),
})

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>
