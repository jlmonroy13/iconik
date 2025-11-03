import { Prisma } from '@/generated/prisma';

// =====================================================
// APPOINTMENT TYPES
// =====================================================

/**
 * Appointment with all related data for display
 */
export type AppointmentWithDetails = Prisma.AppointmentGetPayload<{
  include: {
    client: {
      select: {
        id: true;
        name: true;
        phone: true;
        email: true;
        documentType: true;
        documentNumber: true;
      };
    };
    branch: {
      select: {
        id: true;
        name: true;
        code: true;
      };
    };
    services: {
      include: {
        service: {
          select: {
            id: true;
            name: true;
            price: true;
            duration: true;
            type: true;
          };
        };
        manicurist: {
          select: {
            id: true;
            name: true;
            commission: true;
          };
        };
      };
    };
    manicurist: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

/**
 * Simplified appointment for lists and tables
 */
export type AppointmentListItem = Pick<
  AppointmentWithDetails,
  'id' | 'scheduledAt' | 'status' | 'notes' | 'isScheduled' | 'createdAt'
> & {
  client: {
    id: string;
    name: string;
    phone: string;
  };
  services: Array<{
    service: {
      id: string;
      name: string;
      price: number;
    };
    manicurist: {
      id: string;
      name: string;
    };
    price: number;
  }>;
  totalAmount: number;
  totalDuration: number;
};

/**
 * Note: CreateAppointmentData and UpdateAppointmentData are now defined in './forms'
 * and exported from there. Import them directly from '@/types' or '@/types/forms'.
 */

/**
 * Appointment status enum
 */
export type AppointmentStatus =
  | 'PENDING_APPROVAL'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

/**
 * Filters for appointment queries
 */
export type AppointmentFilters = {
  status?: AppointmentStatus | 'ALL' | 'UPCOMING_AND_CURRENT' | 'PAST';
  manicuristId?: string;
  clientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string; // Search by client name, phone, or document number
  branchId?: string;
};

/**
 * Quick date filter options
 */
export type QuickDateFilter =
  | 'today'
  | 'tomorrow'
  | 'this-week'
  | 'next-week'
  | 'this-month'
  | 'custom';

/**
 * Service in appointment form (for UI state)
 */
export type AppointmentServiceFormData = {
  id: string; // Temporary ID for form state (not DB id)
  serviceId: string;
  manicuristId: string;
  price: number;
  estimatedDuration: number;
  // Cached service data for display
  serviceName?: string;
  manicuristName?: string;
};

/**
 * Form data structure for appointment modal
 */
export type AppointmentFormData = {
  clientId: string;
  scheduledAt: string; // ISO string for form
  isScheduled: boolean;
  notes: string;
  useSameManicurist: boolean; // UI helper
  primaryManicuristId: string; // When using same manicurist for all
  services: AppointmentServiceFormData[];
};

/**
 * Data needed for appointment form dropdowns
 */
export type AppointmentFormDropdownData = {
  clients: Array<{
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  }>;
  services: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
    type: string;
  }>;
  manicurists: Array<{
    id: string;
    name: string;
    commission: number;
    isActive: boolean;
  }>;
};

/**
 * Manicurist availability check result
 */
export type AvailabilityCheckResult = {
  available: boolean;
  conflicts?: Array<{
    appointmentId: string;
    clientName: string;
    scheduledAt: Date;
    estimatedEndTime: Date;
    services: string[];
  }>;
};

/**
 * Calendar day data for mini calendar
 */
export type CalendarDayData = {
  date: Date;
  appointmentCount: number;
  isToday: boolean;
  isSelected: boolean;
  appointments: Array<{
    id: string;
    clientName: string;
    time: string;
    status: AppointmentStatus;
  }>;
};

/**
 * Statistics for appointments dashboard
 */
export type AppointmentStats = {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  noShow: number;
  pendingApproval: number;
  todayTotal: number;
  weekTotal: number;
  monthTotal: number;
};

/**
 * Appointment audit log entry (for future implementation)
 */
export type AppointmentAuditEntry = {
  id: string;
  appointmentId: string;
  action:
    | 'CREATED'
    | 'UPDATED'
    | 'STATUS_CHANGED'
    | 'DELETED'
    | 'SERVICE_ADDED'
    | 'SERVICE_REMOVED';
  changes: Record<string, unknown>;
  userId: string;
  userName: string;
  timestamp: Date;
};
