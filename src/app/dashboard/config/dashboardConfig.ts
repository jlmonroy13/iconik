// Dashboard configuration and constants

export const DASHBOARD_CONFIG = {
  // Time periods for statistics
  timePeriods: {
    today: 'today',
    week: 'week',
    month: 'month',
    year: 'year',
  },

  // Limits for data fetching
  limits: {
    upcomingAppointments: 5,
    recentPayments: 5,
    recentAppointments: 5,
    topManicurists: 3,
    popularServices: 5,
  },

  // Date ranges for upcoming appointments (in days)
  upcomingDays: 7,

  // Status mappings
  appointmentStatuses: {
    SCHEDULED: 'Programada',
    IN_PROGRESS: 'En Progreso',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada',
    NO_SHOW: 'No Presentó',
  },

  // Badge variants for different statuses
  statusBadgeVariants: {
    SCHEDULED: 'secondary',
    IN_PROGRESS: 'default',
    COMPLETED: 'success',
    CANCELLED: 'destructive',
    NO_SHOW: 'destructive',
  },

  // Currency formatting
  currency: {
    locale: 'es-CO',
    currency: 'COP',
    minimumFractionDigits: 0,
  },

  // Date formatting
  dateFormat: {
    locale: 'es-ES',
    dateStyle: 'medium',
    timeStyle: 'short',
  },

  // Refresh intervals (in milliseconds)
  refreshIntervals: {
    stats: 5 * 60 * 1000, // 5 minutes
    appointments: 2 * 60 * 1000, // 2 minutes
    payments: 3 * 60 * 1000, // 3 minutes
  },
} as const;

// Dashboard section configurations
export const DASHBOARD_SECTIONS = {
  todayOverview: {
    title: 'Resumen de Hoy',
    description: 'Estadísticas del día actual',
    icon: 'Activity',
  },
  financialOverview: {
    title: 'Resumen Financiero',
    description: 'Vista general de ingresos y gastos',
    icon: 'BarChart3',
  },
  alerts: {
    title: 'Alertas y Pendientes',
    description: 'Elementos que requieren atención',
    icon: 'AlertCircle',
  },
  upcomingAppointments: {
    title: 'Próximas Citas',
    description: 'Citas programadas para los próximos días',
    icon: 'Calendar',
  },
  recentPayments: {
    title: 'Pagos Recientes',
    description: 'Últimos pagos realizados',
    icon: 'CreditCard',
  },
  topPerformers: {
    title: 'Top Manicuristas del Mes',
    description: 'Manicuristas con mejor rendimiento',
    icon: 'Users',
  },
  popularServices: {
    title: 'Servicios Más Populares',
    description: 'Servicios más solicitados',
    icon: 'Sparkles',
  },
  cashRegister: {
    title: 'Estado de Caja',
    description: 'Información de caja registradora',
    icon: 'CreditCard',
  },
} as const;

// Color schemes for different metrics
export const METRIC_COLORS = {
  positive: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-800 dark:text-green-200',
    value: 'text-green-900 dark:text-green-100',
    icon: 'text-green-600',
  },
  negative: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-800 dark:text-red-200',
    value: 'text-red-900 dark:text-red-100',
    icon: 'text-red-600',
  },
  neutral: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-800 dark:text-blue-200',
    value: 'text-blue-900 dark:text-blue-100',
    icon: 'text-blue-600',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-800 dark:text-yellow-200',
    value: 'text-yellow-900 dark:text-yellow-100',
    icon: 'text-yellow-600',
  },
} as const;
