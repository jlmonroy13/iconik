import { z } from 'zod';

// Base schemas for common fields
export const baseNameSchema = z
  .string()
  .min(1, 'El nombre es requerido')
  .max(100, 'Máximo 100 caracteres');
export const baseEmailSchema = z.string().email('Email inválido');
export const basePhoneSchema = z.string().optional();
export const baseAddressSchema = z
  .string()
  .min(1, 'La dirección es requerida')
  .max(200, 'Máximo 200 caracteres');

// Branch schemas
export const createBranchSchema = z.object({
  name: baseNameSchema,
  code: z
    .string()
    .min(1, 'El código es requerido')
    .max(20, 'Máximo 20 caracteres'),
  description: z.string().optional(),
  address: baseAddressSchema,
  phone: basePhoneSchema,
  email: baseEmailSchema.optional(),
  openingTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
    .optional(),
  closingTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
    .optional(),
  isActive: z.boolean().default(true),
  isMain: z.boolean().default(false),
  invoicePrefix: z.string().optional(),
});

export const updateBranchSchema = createBranchSchema.partial();

// Service schemas
export const createServiceSchema = z.object({
  type: z.enum([
    'MANICURE',
    'PEDICURE',
    'NAIL_ART',
    'GEL_POLISH',
    'ACRYLIC_NAILS',
    'NAIL_REPAIR',
    'HAND_SPA',
    'FOOT_SPA',
    'OTHER',
  ]),
  name: baseNameSchema,
  description: z.string().optional(),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  kitCost: z.number().min(0, 'El costo del kit debe ser mayor a 0').optional(),
  taxRate: z
    .number()
    .min(0)
    .max(1, 'La tasa de impuesto debe estar entre 0 y 1')
    .optional(),
  duration: z.number().min(1, 'La duración debe ser mayor a 0'),
  recommendedReturnDays: z
    .number()
    .min(1, 'Los días de retorno deben ser mayor a 0')
    .optional(),
  imageUrl: z.string().url('URL inválida').optional(),
  isActive: z.boolean().default(true),
  branchId: z.string().optional(), // Optional for multi-branch services
});

export const updateServiceSchema = createServiceSchema.partial();

// Manicurist schemas
export const createManicuristSchema = z.object({
  name: baseNameSchema,
  phone: basePhoneSchema,
  email: baseEmailSchema.optional(),
  commission: z
    .number()
    .min(0)
    .max(1, 'La comisión debe estar entre 0 y 1')
    .default(0.5),
  isActive: z.boolean().default(true),
  branchId: z.string().optional(), // Optional for multi-branch manicurists
});

export const updateManicuristSchema = createManicuristSchema.partial();

// Client schemas
export const createClientSchema = z.object({
  name: baseNameSchema,
  documentType: z.enum(['CC', 'TI', 'CE', 'PA', 'NIT']),
  documentNumber: z.string().min(1, 'El número de documento es requerido'),
  phone: basePhoneSchema,
  email: baseEmailSchema.optional(),
  birthday: z.date().optional(),
  notes: z.string().optional(),
  branchId: z.string().optional(), // Optional for multi-branch clients
});

export const updateClientSchema = createClientSchema.partial();

// User schemas (for super admin and spa admin)
export const createUserSchema = z.object({
  email: baseEmailSchema,
  name: baseNameSchema,
  role: z.enum(['SPA_ADMIN', 'BRANCH_ADMIN', 'MANICURIST', 'CLIENT']),
  spaId: z.string().min(1, 'El spa es requerido'),
  branchId: z.string().optional(), // Required for BRANCH_ADMIN and optional for others
  isActive: z.boolean().default(true),
});

export const updateUserSchema = createUserSchema.partial();

// Spa schemas
export const createSpaSchema = z.object({
  name: baseNameSchema,
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  address: baseAddressSchema.optional(),
  phone: basePhoneSchema,
  email: baseEmailSchema.optional(),
  logoUrl: z.string().url('URL inválida').optional(),
  isActive: z.boolean().default(true),
  openingTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
    .optional(),
  closingTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
    .optional(),
});

export const updateSpaSchema = createSpaSchema.partial();

// Type exports for use in components
export type CreateBranchData = z.infer<typeof createBranchSchema>;
export type UpdateBranchData = z.infer<typeof updateBranchSchema>;
export type CreateServiceData = z.infer<typeof createServiceSchema>;
export type UpdateServiceData = z.infer<typeof updateServiceSchema>;
export type CreateManicuristData = z.infer<typeof createManicuristSchema>;
export type UpdateManicuristData = z.infer<typeof updateManicuristSchema>;
export type CreateClientData = z.infer<typeof createClientSchema>;
export type UpdateClientData = z.infer<typeof updateClientSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type CreateSpaData = z.infer<typeof createSpaSchema>;
export type UpdateSpaData = z.infer<typeof updateSpaSchema>;
