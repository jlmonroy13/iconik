import { z } from 'zod'

export const manicuristScheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6), // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  isActive: z.boolean(),
})

export const manicuristAvailabilitySchema = z.object({
  date: z.date(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAvailable: z.boolean(),
  reason: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isAvailable) {
    if (!data.startTime || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.startTime)) {
      ctx.addIssue({
        path: ['startTime'],
        code: z.ZodIssueCode.custom,
        message: 'Formato de hora inválido (HH:MM)'
      });
    }
    if (!data.endTime || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.endTime)) {
      ctx.addIssue({
        path: ['endTime'],
        code: z.ZodIssueCode.custom,
        message: 'Formato de hora inválido (HH:MM)'
      });
    }
  }
});

export const manicuristFormSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  email: z.string()
    .email('Email inválido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(50, 'El email no puede tener más de 50 caracteres')
    .optional()
    .or(z.literal('')),
  phone: z.string()
    .min(1, 'El teléfono es requerido')
    .regex(/^\+?[0-9\s-]{10,}$/, 'Número de teléfono inválido')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(20, 'El teléfono no puede tener más de 20 caracteres'),
  commission: z.number().min(0).max(100),
  isActive: z.boolean(),
  selectedServices: z.array(z.string()).optional(),
  // New fields for schedules and availability
  schedules: z.array(manicuristScheduleSchema).optional(),
  availability: z.array(manicuristAvailabilitySchema).optional(),
})

export type ManicuristFormData = z.infer<typeof manicuristFormSchema>
export type ManicuristScheduleData = z.infer<typeof manicuristScheduleSchema>
export type ManicuristAvailabilityData = z.infer<typeof manicuristAvailabilitySchema>
