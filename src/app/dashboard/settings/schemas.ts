import { z } from 'zod';

// Basic spa information
export const SpaSettingsSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  email: z.string().email('El email no es válido'),
  logoUrl: z
    .string()
    .url('La URL del logo no es válida')
    .optional()
    .or(z.literal('')),
});

// Individual schedule entry
export const ScheduleEntrySchema = z
  .object({
    isHoliday: z.boolean(),
    isOpen: z.boolean(),
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)'),
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)'),
    dayOfWeek: z.number().min(0).max(6).optional(),
    description: z.string().optional(),
  })
  .refine(data => data.isHoliday || typeof data.dayOfWeek === 'number', {
    message: 'El día de la semana es requerido para días normales',
    path: ['dayOfWeek'],
  });

// Complete operating hours configuration
export const OperatingHoursSchema = z.object({
  schedules: z.array(ScheduleEntrySchema),
  // Legacy fields for backward compatibility
  openingTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
    .optional(),
  closingTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)')
    .optional(),
});

// Default schedule configuration
export const DefaultScheduleConfig = [
  {
    dayOfWeek: 1,
    isHoliday: false,
    isOpen: true,
    startTime: '08:30',
    endTime: '19:00',
    description: 'Lunes',
  },
  {
    dayOfWeek: 2,
    isHoliday: false,
    isOpen: true,
    startTime: '08:30',
    endTime: '19:00',
    description: 'Martes',
  },
  {
    dayOfWeek: 3,
    isHoliday: false,
    isOpen: true,
    startTime: '08:30',
    endTime: '19:00',
    description: 'Miércoles',
  },
  {
    dayOfWeek: 4,
    isHoliday: false,
    isOpen: true,
    startTime: '08:30',
    endTime: '19:00',
    description: 'Jueves',
  },
  {
    dayOfWeek: 5,
    isHoliday: false,
    isOpen: true,
    startTime: '08:30',
    endTime: '19:00',
    description: 'Viernes',
  },
  {
    dayOfWeek: 6,
    isHoliday: false,
    isOpen: true,
    startTime: '08:30',
    endTime: '19:00',
    description: 'Sábado',
  },
  {
    dayOfWeek: 0,
    isHoliday: false,
    isOpen: false,
    startTime: '09:00',
    endTime: '16:00',
    description: 'Domingo - No laboramos',
  },
  {
    dayOfWeek: undefined,
    isHoliday: true,
    isOpen: true,
    startTime: '09:00',
    endTime: '16:00',
    description: 'Festivos',
  },
];

// Notification settings
export const NotificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
  appointmentReminders: z.boolean().default(true),
  followUpReminders: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

// General preferences
export const GeneralPreferencesSchema = z.object({
  timezone: z.string().default('America/Bogota'),
  currency: z.string().default('COP'),
  language: z.string().default('es'),
  dateFormat: z.string().default('DD/MM/YYYY'),
  timeFormat: z.string().default('24h'),
  autoConfirmAppointments: z.boolean().default(false),
  requireApprovalForBookings: z.boolean().default(true),
  allowSameDayBookings: z.boolean().default(false),
  maxAdvanceBookingDays: z.number().min(1).max(365).default(30),
});

// Combined settings schema
export const SettingsSchema = z.object({
  spa: SpaSettingsSchema,
  operatingHours: OperatingHoursSchema,
  notifications: NotificationSettingsSchema,
  preferences: GeneralPreferencesSchema,
});

export type SpaSettingsFormValues = z.infer<typeof SpaSettingsSchema>;
export type ScheduleEntryFormValues = z.infer<typeof ScheduleEntrySchema>;
export type OperatingHoursFormValues = z.infer<typeof OperatingHoursSchema>;
export type NotificationSettingsFormValues = z.infer<
  typeof NotificationSettingsSchema
>;
export type GeneralPreferencesFormValues = z.infer<
  typeof GeneralPreferencesSchema
>;
export type SettingsFormValues = z.infer<typeof SettingsSchema>;

// Sales Goals schemas
export const SalesGoalSchema = z.object({
  name: z.string().min(1, 'El nombre de la meta es requerido'),
  type: z.enum(['REVENUE', 'SERVICES', 'CLIENTS', 'APPOINTMENTS'], {
    required_error: 'El tipo de meta es requerido',
  }),
  period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'], {
    required_error: 'El período es requerido',
  }),
  targetAmount: z.number().min(0.01, 'El monto objetivo debe ser mayor a 0'),
  startDate: z.date({
    required_error: 'La fecha de inicio es requerida',
  }),
  endDate: z.date().optional(),
  isActive: z.boolean().default(true),
  manicuristId: z.string().optional(),
  serviceId: z.string().optional(),
});

export const SalesGoalFormValues = z.object({
  name: z.string().min(1, 'El nombre de la meta es requerido'),
  type: z.enum(['REVENUE', 'SERVICES', 'CLIENTS', 'APPOINTMENTS'], {
    required_error: 'El tipo de meta es requerido',
  }),
  period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'], {
    required_error: 'El período es requerido',
  }),
  targetAmount: z.number().min(0.01, 'El monto objetivo debe ser mayor a 0'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().optional(),
  isActive: z.boolean(),
  manicuristId: z.string().optional(),
  serviceId: z.string().optional(),
});

export type SalesGoalFormValues = z.infer<typeof SalesGoalFormValues>;
