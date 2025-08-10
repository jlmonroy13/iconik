import { z } from 'zod';

export const superAdminCreateSpaSchema = z.object({
  spaName: z.string().min(2, 'El nombre del spa es obligatorio.'),
  spaSlug: z.string().min(2, 'El slug del spa es obligatorio.'),
  spaEmail: z
    .string()
    .email('Correo electrónico inválido.')
    .optional()
    .or(z.literal('')),
  adminName: z.string().min(2, 'El nombre del administrador es obligatorio.'),
  adminEmail: z
    .string()
    .email('Correo electrónico del administrador inválido.'),
});

export type SuperAdminCreateSpaFormData = z.infer<
  typeof superAdminCreateSpaSchema
>;
