import { z } from 'zod';

// Base schemas for common fields
export const baseNameSchema = z
  .string()
  .min(1, 'El nombre es requerido')
  .max(100, 'Máximo 100 caracteres');

export const baseEmailSchema = z.string().email('Email inválido');

// Base schemas for common fields
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
  name: baseNameSchema,
  description: z.string().optional(),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  taxRate: z
    .number()
    .min(0, 'El impuesto debe ser mayor o igual a 0')
    .max(100, 'El impuesto debe ser menor o igual a 100%')
    .optional(),
  duration: z.number().min(1, 'La duración debe ser al menos 1 minuto'),
  recommendedReturnDays: z
    .number()
    .min(1, 'Los días de retorno deben ser al menos 1')
    .optional(),
  type: z.enum([
    'MANICURE_PEDICURE',
    'NAIL_ART',
    'NAIL_EXTENSIONS',
    'NAIL_MAINTENANCE',
    'SPA_TREATMENTS',
  ]),
  image: z.string().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

// Manicurist schemas
export const createManicuristSchema = z.object({
  name: baseNameSchema,
  phone: basePhoneSchema,
  email: baseEmailSchema.optional().or(z.literal('')),
  commission: z.number().min(0).max(1, 'La comisión debe estar entre 0 y 1'),
  isActive: z.boolean(),
  branchId: z.string().optional(), // Optional for multi-branch manicurists
});

export const updateManicuristSchema = createManicuristSchema.partial();

// Client schemas
export const createClientSchema = z.object({
  name: baseNameSchema,
  documentType: z.enum(['CC', 'TI', 'CE', 'PA', 'NIT']),
  documentNumber: z.string().min(1, 'El número de documento es requerido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: baseEmailSchema.optional().or(z.literal('')),
  birthday: z.string().optional(), // ISO date string
  notes: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial().extend({
  id: z.string().cuid(),
});

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

// ============================================
// MANICURIST SERVICES SCHEMAS
// ============================================

/**
 * Schema for assigning services to a manicurist
 */
export const updateManicuristServicesSchema = z.object({
  serviceIds: z.array(z.string().cuid()),
});

// ============================================
// MANICURIST SCHEDULE SCHEMAS
// ============================================

/**
 * Schema for a single schedule item (one day)
 */
export const scheduleItemSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  isActive: z.boolean(),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)'),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)'),
});

/**
 * Schema for updating full weekly schedule
 */
export const updateScheduleSchema = z.object({
  schedules: z.array(scheduleItemSchema),
});

// ============================================
// MANICURIST AVAILABILITY SCHEMAS
// ============================================

/**
 * Schema for creating availability exception (day off)
 */
export const createAvailabilitySchema = z
  .object({
    date: z.string().min(1, 'La fecha es requerida'), // ISO date string (YYYY-MM-DD)
    allDay: z.boolean(), // True = todo el día, False = rango de horas
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
      .optional(), // Required when allDay is false
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
      .optional(), // Required when allDay is false
    reason: z.string().max(200, 'Máximo 200 caracteres').optional(),
  })
  .refine(
    data => {
      // If not all day, both startTime and endTime must be provided
      if (!data.allDay) {
        return !!data.startTime && !!data.endTime;
      }
      return true;
    },
    {
      message:
        'Debes especificar hora de inicio y fin cuando no es todo el día',
      path: ['startTime'],
    }
  )
  .refine(
    data => {
      // If times are provided, endTime must be after startTime
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: 'La hora de fin debe ser posterior a la hora de inicio',
      path: ['endTime'],
    }
  );

export const updateAvailabilitySchema = z
  .object({
    id: z.string().cuid(),
    date: z.string().min(1, 'La fecha es requerida').optional(),
    allDay: z.boolean().optional(),
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
      .optional(),
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
      .optional(),
    reason: z.string().max(200, 'Máximo 200 caracteres').optional(),
  })
  .refine(
    data => {
      // If times are provided, endTime must be after startTime
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: 'La hora de fin debe ser posterior a la hora de inicio',
      path: ['endTime'],
    }
  );

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

// Manicurist-related type exports
export type UpdateManicuristServicesData = z.infer<
  typeof updateManicuristServicesSchema
>;
export type ScheduleItemData = z.infer<typeof scheduleItemSchema>;
export type UpdateScheduleData = z.infer<typeof updateScheduleSchema>;
export type CreateAvailabilityData = z.infer<typeof createAvailabilitySchema>;
export type UpdateAvailabilityData = z.infer<typeof updateAvailabilitySchema>;

// ============================================
// APPOINTMENT SCHEMAS
// ============================================

/**
 * Schema for a single service in an appointment
 */
export const appointmentServiceSchema = z.object({
  serviceId: z.string().cuid('Servicio inválido'),
  manicuristId: z.string().cuid('Manicurista inválida'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  estimatedDuration: z
    .number()
    .min(1, 'La duración debe ser al menos 1 minuto'),
});

/**
 * Schema for creating a new appointment
 */
export const createAppointmentSchema = z.object({
  clientId: z.string().cuid('Cliente inválido'),
  scheduledAt: z
    .string()
    .refine(
      val => {
        // Accept datetime-local format (yyyy-MM-ddTHH:mm) or ISO format
        if (!val) return false;
        // Check if it's a valid datetime-local format or ISO datetime
        const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        const isoDatetimeRegex =
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;
        return datetimeLocalRegex.test(val) || isoDatetimeRegex.test(val);
      },
      {
        message: 'Fecha y hora inválida',
      }
    )
    .refine(
      val => {
        // Validate that date is not in the past (for new appointments)
        if (!val) return false;
        // Parse the datetime-local format
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) {
          const selectedDate = new Date(val);
          const now = new Date();
          return selectedDate >= now;
        }
        // For ISO format, also validate
        const selectedDate = new Date(val);
        const now = new Date();
        return selectedDate >= now;
      },
      {
        message:
          'La fecha y hora deben ser posteriores a la fecha y hora actuales',
      }
    )
    .transform(val => {
      // Convert datetime-local format to ISO format
      // datetime-local doesn't include timezone, so we treat it as local time
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) {
        // Parse as local time and convert to ISO string
        // This preserves the date/time the user selected
        const localDate = new Date(val);
        return localDate.toISOString();
      }
      return val;
    }),
  isScheduled: z.boolean().default(true),
  notes: z.string().max(500, 'Máximo 500 caracteres').default(''),
  services: z
    .array(appointmentServiceSchema)
    .min(1, 'Debe agregar al menos un servicio'),
});

/**
 * Extended schema for appointment form (includes UI-only fields)
 * Note: The date validation that requires future dates is handled in the component
 * using a separate validation, as we don't want to block editing past appointments
 */
export const appointmentFormSchema = createAppointmentSchema
  .omit({ scheduledAt: true })
  .extend({
    scheduledAt: z
      .string()
      .refine(
        val => {
          // Accept datetime-local format (yyyy-MM-ddTHH:mm) or ISO format
          if (!val) return false;
          // Check if it's a valid datetime-local format or ISO datetime
          const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
          const isoDatetimeRegex =
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;
          return datetimeLocalRegex.test(val) || isoDatetimeRegex.test(val);
        },
        {
          message: 'Fecha y hora inválida',
        }
      )
      .transform(val => {
        // Convert datetime-local format to ISO format
        // datetime-local doesn't include timezone, so we treat it as local time
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) {
          // Parse as local time and convert to ISO string
          // This preserves the date/time the user selected
          const localDate = new Date(val);
          return localDate.toISOString();
        }
        return val;
      }),
    useSameManicurist: z.boolean().default(false),
    primaryManicuristId: z.string().default(''),
    // Discount fields (UI-only, not persisted in Appointment)
    applyDiscount: z.boolean().default(false),
    discountType: z.enum(['amount', 'percentage']).optional(),
    discountAmount: z
      .number()
      .min(0, 'El descuento debe ser mayor o igual a 0')
      .optional(),
    discountPercentage: z
      .number()
      .min(0, 'El porcentaje debe ser mayor o igual a 0')
      .max(100, 'El porcentaje no puede ser mayor a 100')
      .optional(),
    discountReason: z.string().max(200, 'Máximo 200 caracteres').optional(),
    discountAffectsCommission: z.boolean().default(false),
  })
  .refine(
    data => {
      // If applyDiscount is true, either discountAmount or discountPercentage must be provided
      if (data.applyDiscount) {
        if (data.discountType === 'amount') {
          return data.discountAmount !== undefined && data.discountAmount > 0;
        } else if (data.discountType === 'percentage') {
          return (
            data.discountPercentage !== undefined &&
            data.discountPercentage > 0 &&
            data.discountPercentage <= 100
          );
        }
      }
      return true;
    },
    {
      message:
        'Debes especificar un monto o porcentaje de descuento cuando está activado',
      path: ['discountAmount'],
    }
  );

/**
 * Schema for updating an existing appointment
 */
export const updateAppointmentSchema = z.object({
  clientId: z.string().cuid('Cliente inválido').optional(),
  scheduledAt: z
    .string()
    .refine(
      val => {
        if (!val) return true; // Optional field
        // Accept datetime-local format (yyyy-MM-ddTHH:mm) or ISO format
        const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        const isoDatetimeRegex =
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?$/;
        return datetimeLocalRegex.test(val) || isoDatetimeRegex.test(val);
      },
      {
        message: 'Fecha y hora inválida',
      }
    )
    .transform(val => {
      if (!val) return val;
      // Convert datetime-local format to ISO format
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) {
        return new Date(val).toISOString();
      }
      return val;
    })
    .optional(),
  notes: z.string().max(500, 'Máximo 500 caracteres').optional(),
  status: z
    .enum([
      'PENDING_APPROVAL',
      'SCHEDULED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
      'NO_SHOW',
    ])
    .optional(),
  services: z.array(appointmentServiceSchema).optional(),
});

/**
 * Schema for updating appointment status only
 */
export const updateAppointmentStatusSchema = z.object({
  status: z.enum([
    'PENDING_APPROVAL',
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
  ]),
});

/**
 * Schema for cancelling an appointment
 */
export const cancelAppointmentSchema = z.object({
  reason: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

/**
 * Schema for adding a service to an existing appointment
 */
export const addAppointmentServiceSchema = z.object({
  serviceId: z.string().cuid('Servicio inválido'),
  manicuristId: z.string().cuid('Manicurista inválida'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  estimatedDuration: z
    .number()
    .min(1, 'La duración debe ser al menos 1 minuto'),
});

// Appointment-related type exports
export type AppointmentServiceData = z.infer<typeof appointmentServiceSchema>;
export type CreateAppointmentData = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentData = z.infer<typeof updateAppointmentSchema>;
export type UpdateAppointmentStatusData = z.infer<
  typeof updateAppointmentStatusSchema
>;
export type CancelAppointmentData = z.infer<typeof cancelAppointmentSchema>;
export type AddAppointmentServiceData = z.infer<
  typeof addAppointmentServiceSchema
>;

// ============================================
// CLIENT NOTE SCHEMAS
// ============================================

/**
 * Schema for creating a client note
 */
export const createClientNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'El contenido de la nota es requerido')
    .max(1000, 'Máximo 1000 caracteres'),
  isImportant: z.boolean().optional().default(false),
});

/**
 * Schema for updating a client note
 */
export const updateClientNoteSchema = z.object({
  content: z
    .string()
    .min(1, 'El contenido de la nota es requerido')
    .max(1000, 'Máximo 1000 caracteres')
    .optional(),
  isImportant: z.boolean().optional(),
});

// Client note type exports
export type CreateClientNoteFormData = z.infer<typeof createClientNoteSchema>;
export type UpdateClientNoteFormData = z.infer<typeof updateClientNoteSchema>;

// ============================================
// PAYMENT METHOD SCHEMAS
// ============================================

/**
 * Schema for creating a payment method
 */
export const createPaymentMethodSchema = z.object({
  name: baseNameSchema,
  type: z.string().optional(),
  icon: z.string().optional(),
  transactionFee: z
    .number()
    .min(0, 'La comisión de transacción debe ser mayor o igual a 0')
    .max(1, 'La comisión de transacción debe ser menor o igual a 100%'),
  isActive: z.boolean().default(true),
});

/**
 * Schema for updating a payment method
 */
export const updatePaymentMethodSchema = createPaymentMethodSchema.partial();

// Payment method type exports
export type CreatePaymentMethodData = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodData = z.infer<typeof updatePaymentMethodSchema>;

// ============================================
// BRANCH SETTINGS SCHEMAS
// ============================================

/**
 * Schema for updating branch basic information
 */
export const updateBranchInfoSchema = z.object({
  name: baseNameSchema.optional(),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  address: baseAddressSchema.optional(),
  phone: basePhoneSchema,
  email: baseEmailSchema.optional().or(z.literal('')),
  openingTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
    .optional()
    .or(z.literal('')),
  closingTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().optional(),
  invoicePrefix: z
    .string()
    .max(10, 'Máximo 10 caracteres')
    .regex(/^[A-Z0-9-]*$/, 'Solo letras mayúsculas, números y guiones')
    .optional()
    .or(z.literal('')),
});

/**
 * Schema for updating branch advanced settings
 */
export const updateBranchSettingsSchema = z.object({
  customTaxRate: z
    .number()
    .min(0, 'El impuesto debe ser mayor o igual a 0')
    .max(100, 'El impuesto debe ser menor o igual a 100')
    .optional(),
  customOperatingHours: z.boolean().optional(),
  enableAllServices: z.boolean().optional(),
  enableAllManicurists: z.boolean().optional(),
  allowNewClients: z.boolean().optional(),
  allowWalkIns: z.boolean().optional(),
  useSpaDianSettings: z.boolean().optional(),
});

// Branch settings type exports
export type UpdateBranchInfoData = z.infer<typeof updateBranchInfoSchema>;
export type UpdateBranchSettingsData = z.infer<
  typeof updateBranchSettingsSchema
>;

// =====================================================
// SPA ACCOUNT SCHEMAS
// =====================================================

export const createSpaAccountSchema = z.object({
  name: baseNameSchema,
  description: z.string().optional(),
  type: z.enum(['BANK_ACCOUNT', 'CASH', 'DIGITAL_WALLET', 'CREDIT_CARD'], {
    required_error: 'El tipo de cuenta es requerido',
  }),
  bank: z.string().optional(),
  accountNumber: z.string().optional(),
  balance: z.number().min(0, 'El balance no puede ser negativo').default(0),
  currency: z.string().default('COP'),
  isActive: z.boolean().default(true),
  branchId: z.string().optional(), // Optional for corporate accounts
});

export const updateSpaAccountSchema = createSpaAccountSchema.partial();

// SpaAccount type exports
export type CreateSpaAccountData = z.infer<typeof createSpaAccountSchema>;
export type UpdateSpaAccountData = z.infer<typeof updateSpaAccountSchema>;

// =====================================================
// EXPENSE SCHEMAS
// =====================================================

export const createExpenseSchema = z.object({
  name: baseNameSchema,
  description: z.string().optional(),
  amount: z.number().min(0, 'El monto debe ser mayor a 0'),
  type: z.enum(['FIXED', 'VARIABLE'], {
    required_error: 'El tipo de gasto es requerido',
  }),
  category: z.enum(
    [
      'RENT',
      'SALARIES',
      'MARKETING',
      'SUPPLIES',
      'UTILITIES',
      'INSURANCE',
      'MAINTENANCE',
      'EQUIPMENT',
      'SOFTWARE',
      'PROFESSIONAL',
      'TRAINING',
      'TRAVEL',
      'FOOD',
      'CLEANING',
      'SECURITY',
      'OTHER',
    ],
    {
      required_error: 'La categoría es requerida',
    }
  ),
  frequency: z.enum(['MONTHLY', 'WEEKLY', 'DAILY', 'ONE_TIME'], {
    required_error: 'La frecuencia es requerida',
  }),
  dueDate: z.string().optional(), // ISO date string
  isActive: z.boolean().default(true),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const createExpensePaymentSchema = z.object({
  expenseId: z.string().cuid('ID de gasto inválido'),
  spaAccountId: z.string().cuid('Debe seleccionar una cuenta'),
  amount: z.number().min(0, 'El monto debe ser mayor a 0'),
  paidAt: z.string().optional(), // ISO date string
  reference: z.string().optional(),
  notes: z.string().optional(),
});

// Expense type exports
export type CreateExpenseData = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseData = z.infer<typeof updateExpenseSchema>;
export type CreateExpensePaymentData = z.infer<
  typeof createExpensePaymentSchema
>;
