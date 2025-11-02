import { prisma } from '@/lib/prisma';

// ============================================
// MANICURIST QUERY OPTIONS
// ============================================

export interface GetManicuristsOptions {
  spaId: string;
  branchId?: string;
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// ============================================
// MANICURIST QUERIES
// ============================================

/**
 * Get manicurists with filtering and pagination
 * Used by: manicurists page
 */
export async function getManicurists(options: GetManicuristsOptions) {
  const {
    spaId,
    branchId,
    search,
    isActive = true,
    page = 1,
    limit = 10,
  } = options;

  const where = {
    spaId,
    ...(branchId && { branchId }),
    isActive,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const skip = (page - 1) * limit;

  const [manicurists, totalCount] = await Promise.all([
    prisma.manicurist.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        branch: {
          select: { id: true, name: true, code: true },
        },
        _count: {
          select: {
            manicuristServices: true,
            schedules: true,
            appointments: true,
          },
        },
      },
    }),
    prisma.manicurist.count({ where }),
  ]);

  return { manicurists, totalCount };
}

/**
 * Get single manicurist with full details
 * Used by: edit/detail modals
 */
export async function getManicuristById(manicuristId: string) {
  return await prisma.manicurist.findUnique({
    where: { id: manicuristId },
    include: {
      branch: true,
      manicuristServices: {
        include: { service: true },
      },
      schedules: {
        orderBy: { dayOfWeek: 'asc' },
      },
      availability: {
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
      },
      _count: {
        select: {
          appointments: true,
          commissions: true,
        },
      },
    },
  });
}

/**
 * Helper function to convert time string (HH:mm) to minutes since midnight
 */
function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Helper function to check if a time falls within a schedule range
 */
function isTimeWithinSchedule(
  timeMinutes: number,
  startTime: string,
  endTime: string
): boolean {
  const startMinutes = timeStringToMinutes(startTime);
  const endMinutes = timeStringToMinutes(endTime);
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

/**
 * Get available manicurists for a specific service, date, and time
 * This function checks:
 * - Service assignment
 * - Day of week schedule
 * - Specific date availability exceptions
 * - Time falls within working hours
 * - Conflicts with existing appointments
 */
export async function getAvailableManicuristsForService(
  spaId: string,
  branchId: string,
  serviceId: string,
  scheduledAt: Date,
  durationMinutes: number,
  excludeAppointmentId?: string
) {
  const dayOfWeek = scheduledAt.getDay();
  // Create dateOnly without mutating the original date
  const dateOnly = new Date(scheduledAt);
  dateOnly.setHours(0, 0, 0, 0);

  // Get time in minutes since midnight
  const scheduledHour = scheduledAt.getHours();
  const scheduledMinute = scheduledAt.getMinutes();
  const scheduledTimeMinutes = scheduledHour * 60 + scheduledMinute;

  // Calculate end time
  const estimatedEndTime = new Date(
    scheduledAt.getTime() + durationMinutes * 60000
  );
  const endTimeMinutes =
    estimatedEndTime.getHours() * 60 + estimatedEndTime.getMinutes();

  // First, get manicurists that match basic criteria
  const manicurists = (await prisma.manicurist.findMany({
    where: {
      spaId,
      branchId,
      isActive: true,

      // Has this service assigned
      manicuristServices: {
        some: {
          serviceId,
          isActive: true,
        },
      },

      // Has schedule for this day of week
      schedules: {
        some: {
          dayOfWeek,
          isActive: true,
        },
      },

      // No unavailability exception for this date
      NOT: {
        availability: {
          some: {
            date: dateOnly,
            isAvailable: false,
          },
        },
      },
    },
    include: {
      schedules: {
        where: { dayOfWeek, isActive: true },
      },
      availability: {
        where: { date: dateOnly },
      },
      manicuristServices: {
        where: { serviceId, isActive: true },
      },
      // Get conflicting appointments to filter them out
      appointments: {
        where: {
          id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
          status: {
            in: ['SCHEDULED', 'IN_PROGRESS'],
          },
          scheduledAt: {
            gte: new Date(dateOnly),
            lt: new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000), // Next day
          },
        },
        include: {
          services: true,
        },
      },
    },
  })) as Array<{
    id: string;
    name: string;
    commission: number;
    isActive: boolean;
    schedules: Array<{ startTime: string; endTime: string }>;
    availability: Array<{
      startTime: string | null;
      endTime: string | null;
      isAvailable: boolean;
    }>;
    appointments: Array<{
      scheduledAt: Date;
      services: Array<{ manicuristId: string; estimatedDuration: number }>;
    }>;
  }>;

  // Filter manicurists based on time constraints and conflicts
  const availableManicurists = manicurists.filter(manicurist => {
    // Check if time falls within working hours
    const schedule = manicurist.schedules[0];
    const specificAvailability = manicurist.availability[0];

    let startTime: string;
    let endTime: string;

    // Use specific availability if exists, otherwise use regular schedule
    if (specificAvailability) {
      startTime =
        specificAvailability.startTime || schedule?.startTime || '00:00';
      endTime = specificAvailability.endTime || schedule?.endTime || '23:59';
    } else if (schedule) {
      startTime = schedule.startTime;
      endTime = schedule.endTime;
    } else {
      // No schedule found, skip this manicurist
      return false;
    }

    // Check if scheduled time and end time fall within working hours
    if (
      !isTimeWithinSchedule(scheduledTimeMinutes, startTime, endTime) ||
      !isTimeWithinSchedule(endTimeMinutes, startTime, endTime)
    ) {
      return false;
    }

    // Check for appointment conflicts
    const hasConflict = manicurist.appointments.some(appointment => {
      const aptStartTime = new Date(appointment.scheduledAt);
      // Sum duration of all services for this manicurist in this appointment
      const aptDuration = appointment.services
        .filter(svc => svc.manicuristId === manicurist.id)
        .reduce((sum, svc) => sum + svc.estimatedDuration, 0);
      const aptEndTime = new Date(aptStartTime.getTime() + aptDuration * 60000);

      // Check for time overlap
      const overlap =
        (scheduledAt >= aptStartTime && scheduledAt < aptEndTime) ||
        (estimatedEndTime > aptStartTime && estimatedEndTime <= aptEndTime) ||
        (scheduledAt <= aptStartTime && estimatedEndTime >= aptEndTime);

      return overlap;
    });

    return !hasConflict;
  });

  // Return only the basic fields needed for dropdown
  return availableManicurists.map(m => ({
    id: m.id,
    name: m.name,
    commission: m.commission,
    isActive: m.isActive,
  }));
}

/**
 * Get all active manicurists (no pagination)
 * Used by: dropdowns, forms
 */
export async function getAllActiveManicurists(
  spaId: string,
  branchId?: string
) {
  return await prisma.manicurist.findMany({
    where: {
      spaId,
      ...(branchId && { branchId }),
      isActive: true,
    },
    orderBy: { name: 'asc' },
    include: {
      branch: {
        select: { id: true, name: true, code: true },
      },
    },
  });
}
