import { z } from 'zod'

export const SpaSettingsSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('El email no es válido'),
})

export type SpaSettingsFormValues = z.infer<typeof SpaSettingsSchema>
