import { z } from 'zod'

export const clientFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  documentType: z.string().min(2, 'El tipo de documento es requerido'),
  documentNumber: z.string().min(5, 'El número de documento es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos').optional().or(z.literal('')),
  birthday: z.string().optional(),
  notes: z.string().optional(),
})

export type ClientFormData = z.infer<typeof clientFormSchema>
