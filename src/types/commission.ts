import { z } from "zod";

// Commission Status Enum
export const CommissionStatusEnum = {
  PENDING: "PENDING",
  PAID: "PAID",
  CANCELLED: "CANCELLED"
} as const;

export type CommissionStatus = typeof CommissionStatusEnum[keyof typeof CommissionStatusEnum];

// Commission Schema
export const CommissionSchema = z.object({
  id: z.string(),
  paymentId: z.string(),
  manicuristId: z.string(),
  serviceAmount: z.number(), // Original service amount before discount
  commissionRate: z.number(), // Commission rate (e.g., 0.5 for 50%)
  commissionAmount: z.number(), // Final commission amount after discount
  spaAmount: z.number(), // Final spa amount after discount
  status: z.nativeEnum(CommissionStatusEnum),

  // Discount tracking
  originalCommissionAmount: z.number(), // Commission amount before discount
  discountAmount: z.number().default(0), // Amount of discount applied to commission
  discountAffectsCommission: z.boolean().default(false), // Whether discount affects commission

  spaId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),

  // Relations
  manicurist: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }).optional(),

  payment: z.object({
    id: z.string(),
    amount: z.number(),
    originalAmount: z.number(),
    discountAmount: z.number(),
    discountReason: z.string().nullable(),
    discountAffectsCommission: z.boolean(),
    paymentMethod: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }).optional(),
});

export type Commission = z.infer<typeof CommissionSchema>;

// Create Commission Schema
export const CreateCommissionSchema = z.object({
  paymentId: z.string(),
  manicuristId: z.string(),
  serviceAmount: z.number(),
  commissionRate: z.number(),
  discountAmount: z.number().default(0),
  discountAffectsCommission: z.boolean().default(false),
  spaId: z.string(),
});

export type CreateCommission = z.infer<typeof CreateCommissionSchema>;

// Update Commission Schema
export const UpdateCommissionSchema = z.object({
  status: z.nativeEnum(CommissionStatusEnum).optional(),
  commissionAmount: z.number().optional(),
  spaAmount: z.number().optional(),
});

export type UpdateCommission = z.infer<typeof UpdateCommissionSchema>;

// Commission Calculation Schema
export const CommissionCalculationSchema = z.object({
  serviceAmount: z.number(),
  commissionRate: z.number(),
  discountAmount: z.number().default(0),
  discountAffectsCommission: z.boolean().default(false),
});

export type CommissionCalculation = z.infer<typeof CommissionCalculationSchema>;

// Commission Calculation Result
export const CommissionCalculationResultSchema = z.object({
  originalServiceAmount: z.number(),
  finalServiceAmount: z.number(),
  discountAmount: z.number(),
  originalCommissionAmount: z.number(),
  finalCommissionAmount: z.number(),
  finalSpaAmount: z.number(),
  discountAffectsCommission: z.boolean(),
});

export type CommissionCalculationResult = z.infer<typeof CommissionCalculationResultSchema>;
