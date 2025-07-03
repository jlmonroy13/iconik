import { z } from 'zod'

export const paymentMethodFormSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  type: z.string()
    .max(20, 'El tipo no puede tener más de 20 caracteres')
    .optional(),
  isActive: z.boolean().default(true),
  icon: z.string()
    .max(100, 'El icono no puede tener más de 100 caracteres')
    .optional()
})

export type PaymentMethodFormData = z.infer<typeof paymentMethodFormSchema>
