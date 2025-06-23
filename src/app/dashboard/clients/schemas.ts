import { z } from 'zod'

export const clientFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  identificationType: z.enum(['CC', 'CE', 'PAS', 'NIT', 'OTRO'], { required_error: 'Selecciona un tipo de identificación' }),
  identification: z.string().min(3, 'La identificación es obligatoria'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  // These fields might not be in the form but are part of the model
  avatar: z.string().optional(),
})

export type ClientFormData = z.infer<typeof clientFormSchema>
