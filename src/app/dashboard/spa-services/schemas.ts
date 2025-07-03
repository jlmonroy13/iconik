import { z } from 'zod'
import { ServiceType } from '@/generated/prisma'
import { shouldHaveKitCost } from '@/lib/utils/calculations'

export const serviceFormSchema = z.object({
  type: z.nativeEnum(ServiceType, { required_error: 'Selecciona un tipo de servicio' }),
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  description: z.string()
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .optional(),
  price: z.number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .max(1000000, 'El precio no puede ser mayor a 1,000,000'),
  kitCost: z.number()
    .min(0, 'El costo del kit debe ser mayor o igual a 0')
    .max(100000, 'El costo del kit no puede ser mayor a 100,000')
    .optional()
    .default(0),
  taxRate: z.number()
    .min(0, 'La tasa de impuesto debe ser mayor o igual a 0')
    .max(1, 'La tasa de impuesto no puede ser mayor a 100% (1.0)')
    .optional()
    .default(0),
  duration: z.number()
    .int('La duración debe ser un número entero')
    .min(5, 'La duración mínima es 5 minutos')
    .max(480, 'La duración máxima es 8 horas (480 minutos)'),
  imageUrl: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  isActive: z.boolean().default(true)
}).superRefine((data, ctx) => {
  if (!shouldHaveKitCost(data.type) && data.kitCost && data.kitCost > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Este tipo de servicio no requiere costo de kit',
      path: ['kitCost']
    })
  }
})

export type ServiceFormData = z.infer<typeof serviceFormSchema>
