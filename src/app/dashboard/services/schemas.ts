import { z } from 'zod'

export const serviceFormSchema = z.object({
  name: z.string().min(3, 'El nombre es obligatorio'),
  description: z.string().optional(),
  price: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  duration: z.coerce.number().min(1, 'La duración debe ser mayor a 0'),
  category: z.enum(['MANOS', 'PIES', 'DEPILACION', 'OTRO'], { required_error: 'Selecciona una categoría' }),
  status: z.enum(['ACTIVE', 'INACTIVE']),
})

export type ServiceFormData = z.infer<typeof serviceFormSchema>
