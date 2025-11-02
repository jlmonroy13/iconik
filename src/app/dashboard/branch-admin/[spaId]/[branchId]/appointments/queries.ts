import { prisma, Prisma } from '@/lib/prisma';
import type {
  AppointmentWithDetails,
  AppointmentFilters,
  AppointmentFormDropdownData,
  AvailabilityCheckResult,
  QuickDateFilter,
} from '@/types';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
} from 'date-fns';

// =====================================================
// QUERY FUNCTIONS
// =====================================================

/**
 * Get appointments with pagination and filters
 */
export async function getAppointments({
  spaId,
  branchId,
  filters = {},
  page = 1,
  limit = 10,
}: {
  spaId: string;
  branchId?: string;
  filters?: AppointmentFilters;
  page?: number;
  limit?: number;
}): Promise<{
  appointments: AppointmentWithDetails[];
  totalCount: number;
}> {
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.AppointmentWhereInput = {
    spaId,
    ...(branchId && { branchId }),
  };

  // Status filter
  if (filters.status && filters.status !== 'ALL') {
    where.status = filters.status;
  }

  // Manicurist filter
  if (filters.manicuristId) {
    where.services = {
      some: {
        manicuristId: filters.manicuristId,
      },
    };
  }

  // Client filter
  if (filters.clientId) {
    where.clientId = filters.clientId;
  }

  // Date range filter
  if (filters.dateFrom || filters.dateTo) {
    where.scheduledAt = {};
    if (filters.dateFrom) {
      where.scheduledAt.gte = filters.dateFrom;
    }
    if (filters.dateTo) {
      where.scheduledAt.lte = filters.dateTo;
    }
  }

  // Search filter (client name, phone, or document number)
  if (filters.search) {
    where.client = {
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        { documentNumber: { contains: filters.search } },
      ],
    };
  }

  // Execute queries
  const [appointments, totalCount] = await Promise.all([
    prisma.appointment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        scheduledAt: 'asc',
      },
      include: {
        client: true,
        branch: true,
        services: {
          include: {
            service: true,
            manicurist: true,
          },
        },
        manicurist: true,
        payments: {
          include: {
            paymentMethod: true,
          },
        },
      },
    }),
    prisma.appointment.count({ where }),
  ]);

  return {
    appointments,
    totalCount,
  };
}

/**
 * Get a single appointment by ID with all details
 */
export async function getAppointmentById(
  appointmentId: string,
  spaId: string
): Promise<AppointmentWithDetails | null> {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      spaId,
    },
    include: {
      client: true,
      branch: true,
      services: {
        include: {
          service: true,
          manicurist: true,
        },
      },
      manicurist: true,
      payments: {
        include: {
          paymentMethod: true,
        },
      },
    },
  });

  return appointment;
}

/**
 * Get data needed for appointment form (clients, services, manicurists)
 */
export async function getAppointmentFormData(
  spaId: string,
  branchId?: string
): Promise<AppointmentFormDropdownData> {
  // Build where clauses
  const clientWhere: Prisma.ClientWhereInput = { spaId };
  const manicuristWhere: Prisma.ManicuristWhereInput = {
    spaId,
    isActive: true,
  };

  if (branchId) {
    clientWhere.branchId = branchId;
    manicuristWhere.branchId = branchId;
  }

  const [clients, services, manicurists] = await Promise.all([
    // Get clients for this spa/branch
    prisma.client.findMany({
      where: clientWhere,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),

    // Get services for this spa/branch
    prisma.service.findMany({
      where: {
        spaId,
        ...(branchId && { branchId }),
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        type: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),

    // Get manicurists for this spa/branch
    prisma.manicurist.findMany({
      where: manicuristWhere,
      select: {
        id: true,
        name: true,
        commission: true,
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ]);

  return {
    clients,
    services,
    manicurists,
  } as AppointmentFormDropdownData;
}

/**
 * Check if a manicurist is available at a specific time
 * Returns conflicts if any
 */
export async function checkManicuristAvailability(
  manicuristId: string,
  scheduledAt: Date,
  durationMinutes: number,
  excludeAppointmentId?: string
): Promise<AvailabilityCheckResult> {
  // Calculate end time
  const estimatedEndTime = new Date(
    scheduledAt.getTime() + durationMinutes * 60000
  );

  // Find conflicting appointments
  const conflicts = await prisma.appointment.findMany({
    where: {
      id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
      services: {
        some: {
          manicuristId,
        },
      },
      status: {
        in: ['SCHEDULED', 'IN_PROGRESS'],
      },
      // Check for time overlap
      OR: [
        // New appointment starts during existing appointment
        {
          AND: [
            { scheduledAt: { lte: scheduledAt } },
            // We need to calculate end time, but for simplicity we'll check if they start on the same day
            {
              scheduledAt: {
                gte: startOfDay(scheduledAt),
                lte: endOfDay(scheduledAt),
              },
            },
          ],
        },
      ],
    },
    include: {
      client: {
        select: {
          name: true,
        },
      },
      services: {
        where: {
          manicuristId,
        },
        include: {
          service: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // Process conflicts to calculate actual overlap
  const actualConflicts = conflicts
    .map(apt => {
      const aptDuration = apt.services.reduce(
        (sum, svc) => sum + svc.estimatedDuration,
        0
      );
      const aptEndTime = new Date(
        apt.scheduledAt.getTime() + aptDuration * 60000
      );

      // Check if there's actual time overlap
      const hasOverlap =
        (scheduledAt >= apt.scheduledAt && scheduledAt < aptEndTime) ||
        (estimatedEndTime > apt.scheduledAt &&
          estimatedEndTime <= aptEndTime) ||
        (scheduledAt <= apt.scheduledAt && estimatedEndTime >= aptEndTime);

      if (hasOverlap) {
        return {
          appointmentId: apt.id,
          clientName: apt.client.name,
          scheduledAt: apt.scheduledAt,
          estimatedEndTime: aptEndTime,
          services: apt.services.map(s => s.service.name),
        };
      }
      return null;
    })
    .filter(Boolean) as AvailabilityCheckResult['conflicts'];

  return {
    available: (actualConflicts?.length ?? 0) === 0,
    conflicts: (actualConflicts?.length ?? 0) > 0 ? actualConflicts : undefined,
  };
}

/**
 * Get appointments for a specific date range (for calendar view)
 */
export async function getAppointmentsByDateRange(
  spaId: string,
  branchId: string | undefined,
  startDate: Date,
  endDate: Date
): Promise<AppointmentWithDetails[]> {
  const appointments = await prisma.appointment.findMany({
    where: {
      spaId,
      ...(branchId && { branchId }),
      scheduledAt: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        not: 'CANCELLED',
      },
    },
    include: {
      client: true,
      branch: true,
      services: {
        include: {
          service: true,
          manicurist: true,
        },
      },
      manicurist: true,
      payments: {
        include: {
          paymentMethod: true,
        },
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  });

  return appointments;
}

/**
 * Helper function to convert quick date filter to actual date range
 */
export function getDateRangeFromQuickFilter(
  filter: QuickDateFilter
): { dateFrom: Date; dateTo: Date } | null {
  const now = new Date();

  switch (filter) {
    case 'today':
      return {
        dateFrom: startOfDay(now),
        dateTo: endOfDay(now),
      };

    case 'tomorrow':
      const tomorrow = addDays(now, 1);
      return {
        dateFrom: startOfDay(tomorrow),
        dateTo: endOfDay(tomorrow),
      };

    case 'this-week':
      return {
        dateFrom: startOfWeek(now, { weekStartsOn: 0 }), // Sunday
        dateTo: endOfWeek(now, { weekStartsOn: 0 }),
      };

    case 'next-week':
      const nextWeekStart = addDays(startOfWeek(now, { weekStartsOn: 0 }), 7);
      return {
        dateFrom: nextWeekStart,
        dateTo: addDays(nextWeekStart, 6),
      };

    case 'this-month':
      return {
        dateFrom: startOfMonth(now),
        dateTo: endOfMonth(now),
      };

    case 'custom':
      return null; // Custom range handled separately

    default:
      return null;
  }
}

/**
 * Helper function to detect which quick filter matches a date range
 */
export function getQuickFilterFromDateRange(
  dateFrom?: Date,
  dateTo?: Date
): QuickDateFilter {
  if (!dateFrom || !dateTo) {
    return 'custom';
  }

  const fromStart = startOfDay(dateFrom);
  const toEnd = endOfDay(dateTo);

  // Check today
  const todayRange = getDateRangeFromQuickFilter('today');
  if (
    todayRange &&
    fromStart.getTime() === startOfDay(todayRange.dateFrom).getTime() &&
    toEnd.getTime() === endOfDay(todayRange.dateTo).getTime()
  ) {
    return 'today';
  }

  // Check tomorrow
  const tomorrowRange = getDateRangeFromQuickFilter('tomorrow');
  if (
    tomorrowRange &&
    fromStart.getTime() === startOfDay(tomorrowRange.dateFrom).getTime() &&
    toEnd.getTime() === endOfDay(tomorrowRange.dateTo).getTime()
  ) {
    return 'tomorrow';
  }

  // Check this week
  const thisWeekRange = getDateRangeFromQuickFilter('this-week');
  if (
    thisWeekRange &&
    fromStart.getTime() === startOfDay(thisWeekRange.dateFrom).getTime() &&
    toEnd.getTime() === endOfDay(thisWeekRange.dateTo).getTime()
  ) {
    return 'this-week';
  }

  // Check next week
  const nextWeekRange = getDateRangeFromQuickFilter('next-week');
  if (
    nextWeekRange &&
    fromStart.getTime() === startOfDay(nextWeekRange.dateFrom).getTime() &&
    toEnd.getTime() === endOfDay(nextWeekRange.dateTo).getTime()
  ) {
    return 'next-week';
  }

  // Check this month
  const thisMonthRange = getDateRangeFromQuickFilter('this-month');
  if (
    thisMonthRange &&
    fromStart.getTime() === startOfDay(thisMonthRange.dateFrom).getTime() &&
    toEnd.getTime() === endOfDay(thisMonthRange.dateTo).getTime()
  ) {
    return 'this-month';
  }

  // Default to custom
  return 'custom';
}

/**
 * Get appointment statistics
 */
export async function getAppointmentStats(
  spaId: string,
  branchId?: string
): Promise<{
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  noShow: number;
  todayTotal: number;
}> {
  const where: Prisma.AppointmentWhereInput = {
    spaId,
    ...(branchId && { branchId }),
  };

  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const [
    total,
    scheduled,
    inProgress,
    completed,
    cancelled,
    noShow,
    todayTotal,
  ] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.count({ where: { ...where, status: 'SCHEDULED' } }),
    prisma.appointment.count({ where: { ...where, status: 'IN_PROGRESS' } }),
    prisma.appointment.count({ where: { ...where, status: 'COMPLETED' } }),
    prisma.appointment.count({ where: { ...where, status: 'CANCELLED' } }),
    prisma.appointment.count({ where: { ...where, status: 'NO_SHOW' } }),
    prisma.appointment.count({
      where: {
        ...where,
        scheduledAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),
  ]);

  return {
    total,
    scheduled,
    inProgress,
    completed,
    cancelled,
    noShow,
    todayTotal,
  };
}
