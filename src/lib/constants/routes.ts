// Public routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SUPER_ADMIN_LOGIN: '/superadmin/login',
} as const

// Protected routes
export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  SUPER_ADMIN_DASHBOARD: '/superadmin/dashboard',
  ONBOARDING: '/onboarding',
} as const

// API routes
export const API_ROUTES = {
  DASHBOARD: '/api/dashboard',
  AUTH: '/api/auth',
} as const

// All routes combined for easy access
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
  ...API_ROUTES,
} as const

// Type for route values
export type RouteValue = typeof ROUTES[keyof typeof ROUTES]
