import { z } from 'zod'

// Schema for updating the user's profile information
export const ProfileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
})
export type ProfileFormValues = z.infer<typeof ProfileFormSchema>


// Schema for changing the user's password
export const PasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: 'Debes ingresar tu contraseña actual.',
    }),
    newPassword: z.string().min(8, {
      message: 'La nueva contraseña debe tener al menos 8 caracteres.',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })
export type PasswordFormValues = z.infer<typeof PasswordFormSchema>
