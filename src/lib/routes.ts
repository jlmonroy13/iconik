import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  Users,
  Paintbrush,
  LineChart
} from 'lucide-react'

// Dashboard Routes - Single source of truth
export const ROUTES = {
  // Public routes
  HOME: '/',

  // Dashboard routes
  DASHBOARD: '/dashboard',
  SERVICES: '/dashboard/spa-services',
  APPOINTMENTS: '/dashboard/appointments',
  CLIENTS: '/dashboard/clients',
  MANICURISTS: '/dashboard/manicurists',
  REPORTS: '/dashboard/reports',
  SETTINGS: '/dashboard/settings'
} as const

// Navigation configuration with route constants
export const NAVIGATION_ITEMS = [
  {
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    label: 'Dashboard'
  },
  {
    href: ROUTES.SERVICES,
    icon: Sparkles,
    label: 'Servicios'
  },
  {
    href: ROUTES.APPOINTMENTS,
    icon: Calendar,
    label: 'Citas'
  },
  {
    href: ROUTES.CLIENTS,
    icon: Users,
    label: 'Clientes'
  },
  {
    href: ROUTES.MANICURISTS,
    icon: Paintbrush,
    label: 'Manicuristas'
  },
  {
    href: ROUTES.REPORTS,
    icon: LineChart,
    label: 'Reportes'
  }
] as const

// Header configuration for each route
export const HEADER_CONFIG = {
  [ROUTES.DASHBOARD]: {
    title: 'Panel de Control',
    subtitle: 'Gestiona tu spa de uñas',
    action: {
      label: 'Nuevo Servicio',
      mobileLabel: 'Nuevo'
    }
  },
  [ROUTES.SERVICES]: {
    title: 'Servicios Realizados',
    subtitle: 'Historial completo de servicios de tu spa',
    action: {
      label: 'Nuevo Servicio',
      mobileLabel: 'Nuevo'
    }
  },
  [ROUTES.APPOINTMENTS]: {
    title: 'Citas',
    subtitle: 'Programa y administra las citas',
    action: {
      label: 'Nueva Cita',
      mobileLabel: 'Nueva'
    }
  },
  [ROUTES.CLIENTS]: {
    title: 'Clientes',
    subtitle: 'Administra tu base de clientes',
    action: {
      label: 'Nuevo Cliente',
      mobileLabel: 'Nuevo'
    }
  },
  [ROUTES.MANICURISTS]: {
    title: 'Manicuristas',
    subtitle: 'Administra tu equipo de trabajo',
    action: {
      label: 'Nueva Manicurista',
      mobileLabel: 'Nueva'
    }
  },
  [ROUTES.REPORTS]: {
    title: 'Reportes y Analíticas',
    subtitle: 'Visualiza métricas y estadísticas',
    action: {
      label: 'Generar Reporte',
      mobileLabel: 'Reporte'
    }
  },
  [ROUTES.SETTINGS]: {
    title: 'Configuración',
    subtitle: 'Administra la información de tu spa',
    action: {
      label: 'Guardar Cambios',
      mobileLabel: 'Guardar'
    }
  }
} as const

// Type helpers for better TypeScript support
export type RouteKeys = keyof typeof ROUTES
export type RouteValues = typeof ROUTES[RouteKeys]
export type DashboardRoutes = typeof ROUTES.DASHBOARD | typeof ROUTES.SERVICES | typeof ROUTES.APPOINTMENTS | typeof ROUTES.CLIENTS | typeof ROUTES.MANICURISTS | typeof ROUTES.REPORTS | typeof ROUTES.SETTINGS
export type HeaderConfig = typeof HEADER_CONFIG[DashboardRoutes]
