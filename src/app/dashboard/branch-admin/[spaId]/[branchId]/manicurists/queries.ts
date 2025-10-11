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
 * Get available manicurists for a specific service and date
 * Used by: appointment booking forms
 */
export async function getAvailableManicuristsForService(
  spaId: string,
  branchId: string,
  serviceId: string,
  date: Date
) {
  const dayOfWeek = date.getDay();
  const dateOnly = new Date(date.setHours(0, 0, 0, 0));

  return await prisma.manicurist.findMany({
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
        where: { dayOfWeek },
      },
      availability: {
        where: { date: dateOnly },
      },
      manicuristServices: {
        where: { serviceId },
      },
    },
  });
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
