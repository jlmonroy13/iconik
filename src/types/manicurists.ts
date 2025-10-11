import type { Prisma } from '@/generated/prisma';

// ============================================
// MANICURIST TYPES WITH RELATIONS
// ============================================

/**
 * Manicurist with basic counts
 * Used by: Main list page
 */
export type ManicuristWithCounts = Prisma.ManicuristGetPayload<{
  include: {
    branch: {
      select: { id: true; name: true; code: true };
    };
    _count: {
      select: {
        manicuristServices: true;
        schedules: true;
        appointments: true;
      };
    };
  };
}>;

/**
 * Manicurist with assigned services
 * Used by: Services modal
 */
export type ManicuristWithServices = Prisma.ManicuristGetPayload<{
  include: {
    manicuristServices: {
      include: { service: true };
    };
  };
}>;

/**
 * Manicurist with schedule details
 * Used by: Schedule and availability modals
 */
export type ManicuristWithSchedule = Prisma.ManicuristGetPayload<{
  include: {
    schedules: true;
    availability: true;
  };
}>;

/**
 * Full manicurist data with all relations
 * Used by: Detail views, complex operations
 */
export type ManicuristFull = Prisma.ManicuristGetPayload<{
  include: {
    branch: true;
    manicuristServices: {
      include: { service: true };
    };
    schedules: true;
    availability: true;
    _count: {
      select: {
        appointments: true;
        commissions: true;
      };
    };
  };
}>;

// ============================================
// UI HELPER TYPES
// ============================================

/**
 * Pagination information
 */
export interface ManicuristPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

/**
 * Search and filter parameters
 */
export interface ManicuristSearchParams {
  search?: string;
  page?: string;
  limit?: string;
  status?: 'all' | 'active' | 'inactive';
}

/**
 * Branch info for display
 */
export interface BranchInfo {
  id: string;
  name: string;
  spa: { name: string };
}

// ============================================
// SCHEDULE TYPES
// ============================================

/**
 * Schedule item for a specific day
 */
export interface ScheduleItem {
  dayOfWeek: number; // 0-6 (Sunday=0)
  isActive: boolean;
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
}

/**
 * Day names mapping
 */
export const DAY_NAMES: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

/**
 * Default schedule template (Monday to Saturday, 9-18)
 */
export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { dayOfWeek: 1, isActive: true, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 2, isActive: true, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 3, isActive: true, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 4, isActive: true, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 5, isActive: true, startTime: '09:00', endTime: '18:00' },
  { dayOfWeek: 6, isActive: true, startTime: '09:00', endTime: '14:00' },
  { dayOfWeek: 0, isActive: false, startTime: '09:00', endTime: '18:00' },
];

// ============================================
// AVAILABILITY EXCEPTION TYPES
// ============================================

/**
 * Availability exception (vacation, special hours, etc.)
 */
export interface AvailabilityException {
  id: string;
  date: Date;
  isAvailable: boolean; // false = day off, true = special hours
  startTime?: string | null;
  endTime?: string | null;
  reason?: string | null;
}

/**
 * Grouped services by type for display
 */
export interface GroupedServices {
  [type: string]: Array<{
    id: string;
    name: string;
    price: number;
    type: string;
  }>;
}
