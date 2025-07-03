import { z } from 'zod'

export const clientFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos').optional().or(z.literal('')),
  birthday: z.date().optional(),
  notes: z.string().optional(),
})

export type ClientFormData = z.infer<typeof clientFormSchema>
