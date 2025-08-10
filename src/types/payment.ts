import { z } from 'zod';

// Payment Schema
export const PaymentSchema = z.object({
  id: z.string(),
  appointmentId: z.string().nullable(),
  appointmentServiceId: z.string().nullable(),
  paymentMethodId: z.string(),
  amount: z.number(), // Final amount after discount
  paidAt: z.date(),
  reference: z.string().nullable(),

  // Discount fields
  originalAmount: z.number(), // Original amount before discount
  discountAmount: z.number().default(0), // Amount of discount
  discountReason: z.string().nullable(), // Reason for discount
  discountAffectsCommission: z.boolean().default(false), // If true, discount affects manicurist commission

  spaId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),

  // Relations
  appointment: z
    .object({
      id: z.string(),
      scheduledAt: z.date(),
      status: z.string(),
    })
    .optional(),

  appointmentService: z
    .object({
      id: z.string(),
      price: z.number(),
      service: z.object({
        id: z.string(),
        name: z.string(),
      }),
    })
    .optional(),

  paymentMethod: z.object({
    id: z.string(),
    name: z.string(),
    type: z.string().nullable(),
    icon: z.string().nullable(),
  }),

  commission: z
    .object({
      id: z.string(),
      commissionAmount: z.number(),
      spaAmount: z.number(),
      status: z.string(),
    })
    .optional(),
});

export type Payment = z.infer<typeof PaymentSchema>;

// Create Payment Schema
export const CreatePaymentSchema = z.object({
  appointmentId: z.string().optional(),
  appointmentServiceId: z.string().optional(),
  paymentMethodId: z.string(),
  amount: z.number(),
  reference: z.string().optional(),

  // Discount fields
  originalAmount: z.number(),
  discountAmount: z.number().default(0),
  discountReason: z.string().optional(),
  discountAffectsCommission: z.boolean().default(false),

  spaId: z.string(),
});

export type CreatePayment = z.infer<typeof CreatePaymentSchema>;

// Update Payment Schema
export const UpdatePaymentSchema = z.object({
  paymentMethodId: z.string().optional(),
  amount: z.number().optional(),
  reference: z.string().optional(),

  // Discount fields
  originalAmount: z.number().optional(),
  discountAmount: z.number().optional(),
  discountReason: z.string().optional(),
  discountAffectsCommission: z.boolean().optional(),
});

export type UpdatePayment = z.infer<typeof UpdatePaymentSchema>;

// Payment Summary Schema
export const PaymentSummarySchema = z.object({
  totalPayments: z.number(),
  totalAmount: z.number(),
  totalOriginalAmount: z.number(),
  totalDiscountAmount: z.number(),
  paymentMethodBreakdown: z.array(
    z.object({
      paymentMethodId: z.string(),
      paymentMethodName: z.string(),
      count: z.number(),
      amount: z.number(),
    })
  ),
});

export type PaymentSummary = z.infer<typeof PaymentSummarySchema>;

// Discount Configuration Schema
export const DiscountConfigSchema = z.object({
  discountAmount: z.number().min(0),
  discountReason: z.string().min(1, 'Discount reason is required'),
  discountAffectsCommission: z.boolean().default(false),
});

export type DiscountConfig = z.infer<typeof DiscountConfigSchema>;
