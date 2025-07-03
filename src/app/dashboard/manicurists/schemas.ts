import { z } from 'zod'

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
    .regex(/^\+?[0-9\s-]{10,}$/, 'Número de teléfono inválido')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(20, 'El teléfono no puede tener más de 20 caracteres')
    .optional()
    .or(z.literal('')),
  specialty: z.string().optional(),
  commission: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
})

export type ManicuristFormData = z.infer<typeof manicuristFormSchema>
