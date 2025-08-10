import { z } from 'zod';

export const paymentFormSchema = z
  .object({
    appointmentId: z.string().optional(),
    appointmentServiceId: z.string().optional(),
    paymentMethodId: z.string({
      required_error: 'Selecciona un método de pago',
    }),
    amount: z
      .number()
      .min(0.01, 'El monto debe ser mayor a 0')
      .max(1000000, 'El monto no puede ser mayor a 1,000,000'),
    reference: z
      .string()
      .max(100, 'La referencia no puede tener más de 100 caracteres')
      .optional(),
  })
  .refine(data => data.appointmentId || data.appointmentServiceId, {
    message: 'Debes seleccionar una cita o un servicio específico',
    path: ['appointmentId'],
  });

export type PaymentFormData = z.infer<typeof paymentFormSchema>;
