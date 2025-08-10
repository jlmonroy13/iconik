import { z } from 'zod';
import { ServiceTimeRating } from '@/generated/prisma';

export const feedbackFormSchema = z.object({
  serviceTimeRating: z.nativeEnum(ServiceTimeRating, {
    required_error: 'Evalúa el tiempo del servicio',
  }),
  workQualityRating: z
    .number()
    .int('La calificación debe ser un número entero')
    .min(1, 'La calificación mínima es 1 estrella')
    .max(5, 'La calificación máxima es 5 estrellas'),
  manicuristAttentionRating: z
    .number()
    .int('La calificación debe ser un número entero')
    .min(1, 'La calificación mínima es 1 estrella')
    .max(5, 'La calificación máxima es 5 estrellas'),
  spaAdminAttentionRating: z
    .number()
    .int('La calificación debe ser un número entero')
    .min(1, 'La calificación mínima es 1 estrella')
    .max(5, 'La calificación máxima es 5 estrellas'),
  comment: z
    .string()
    .max(1000, 'El comentario no puede tener más de 1000 caracteres')
    .optional(),
});

export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;
