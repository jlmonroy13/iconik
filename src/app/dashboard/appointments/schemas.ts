import { z } from 'zod';
import { AppointmentStatus } from '@/generated/prisma';

export const appointmentServiceFormSchema = z.object({
  serviceId: z.string({
    required_error: 'Selecciona un servicio',
  }),
  manicuristId: z.string({
    required_error: 'Selecciona una manicurista',
  }),
  price: z
    .number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .max(1000000, 'El precio no puede ser mayor a 1,000,000'),
});

export const appointmentFormSchema = z.object({
  clientId: z.string({
    required_error: 'Selecciona un cliente',
  }),
  isScheduled: z.boolean({
    required_error: 'Debes indicar si la cita es programada o walk-in',
  }),
  scheduledAt: z.date({
    required_error: 'Selecciona una fecha y hora',
  }),
  status: z.nativeEnum(AppointmentStatus, {
    required_error: 'Selecciona un estado',
  }),
  notes: z
    .string()
    .max(500, 'Las notas no pueden tener más de 500 caracteres')
    .optional(),
  services: z
    .array(appointmentServiceFormSchema)
    .min(1, 'Debes agregar al menos un servicio')
    .max(10, 'No puedes agregar más de 10 servicios'),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;
export type AppointmentServiceFormData = z.infer<
  typeof appointmentServiceFormSchema
>;
