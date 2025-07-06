import { z } from 'zod'
// import { ServiceType } from '@/generated/prisma'
// import { shouldHaveKitCost } from '@/lib/utils/calculations'

export const serviceFormSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  description: z.string()
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .optional(),
  price: z.number({
    required_error: 'El precio es requerido',
    invalid_type_error: 'El precio debe ser un número',
  })
    .min(0, 'El precio debe ser mayor o igual a 0')
    .max(100000, 'El precio no puede ser mayor a 100,000'),
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
  isActive: z.boolean().default(true),
  recommendedReturnDays: z.number()
    .int('El número de días debe ser un número entero')
    .min(0, 'Debe ser 0 o mayor')
    .max(365, 'No puede ser mayor a 365 días')
    .optional()
    .default(0),
})

export type ServiceFormData = z.infer<typeof serviceFormSchema>
