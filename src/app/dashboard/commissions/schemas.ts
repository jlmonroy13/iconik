import { z } from 'zod'

export const commissionFormSchema = z.object({
  paymentId: z.string({
    required_error: 'Selecciona un pago'
  }),
  manicuristId: z.string({
    required_error: 'Selecciona una manicurista'
  }),
  appointmentServiceId: z.string({
    required_error: 'Selecciona un servicio'
  }),
  serviceAmount: z.number()
    .min(0.01, 'El monto del servicio debe ser mayor a 0')
    .max(1000000, 'El monto no puede ser mayor a 1,000,000'),
  commissionRate: z.number()
    .min(0, 'La comisión debe ser mayor o igual a 0')
    .max(1, 'La comisión no puede ser mayor a 100%'),
  isPaid: z.boolean().default(false),
  paymentReference: z.string()
    .max(100, 'La referencia no puede tener más de 100 caracteres')
    .optional()
})

export const commissionPaymentFormSchema = z.object({
  commissionId: z.string({
    required_error: 'Selecciona una comisión'
  }),
  paymentReference: z.string()
    .min(1, 'La referencia de pago es obligatoria')
    .max(100, 'La referencia no puede tener más de 100 caracteres'),
  paidAt: z.date({
    required_error: 'Selecciona la fecha de pago'
  })
})

export type CommissionFormData = z.infer<typeof commissionFormSchema>
export type CommissionPaymentFormData = z.infer<typeof commissionPaymentFormSchema>
