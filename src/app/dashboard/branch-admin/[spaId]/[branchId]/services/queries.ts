import { prisma } from '@/lib/prisma';
import { ServiceType } from '@/generated/prisma';

// ============================================
// SERVICE QUERY OPTIONS
// ============================================

export interface GetServicesOptions {
  spaId: string;
  branchId?: string;
  search?: string;
  type?: ServiceType;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// ============================================
// SERVICE QUERIES
// ============================================

/**
 * Get services with filtering and pagination
 * Used by: services page, filters
 */
export async function getServices(options: GetServicesOptions) {
  const {
    spaId,
    branchId,
    search,
    type,
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
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(type && { type }),
  };

  const skip = (page - 1) * limit;

  const [services, totalCount] = await Promise.all([
    prisma.service.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        branch: {
          select: { id: true, name: true, code: true },
        },
      },
    }),
    prisma.service.count({ where }),
  ]);

  return { services, totalCount };
}

/**
 * Get all active services (no pagination)
 * Used by: modals, dropdowns, forms
 */
export async function getAllActiveServices(spaId: string, branchId?: string) {
  return await prisma.service.findMany({
    where: {
      spaId,
      ...(branchId && { branchId }),
      isActive: true,
    },
    orderBy: { name: 'asc' },
  });
}

/**
 * Get services grouped by type
 * Used by: manicurist services assignment modal
 */
export async function getServicesGroupedByType(
  spaId: string,
  branchId?: string
) {
  const services = await getAllActiveServices(spaId, branchId);

  // Group by ServiceType
  const grouped = services.reduce(
    (acc, service) => {
      const type = service.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(service);
      return acc;
    },
    {} as Record<ServiceType, typeof services>
  );

  return grouped;
}

/**
 * Get single service by ID
 * Used by: service detail/edit views
 */
export async function getServiceById(serviceId: string) {
  return await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      branch: true,
      _count: {
        select: {
          appointmentServices: true,
          manicuristServices: true,
        },
      },
    },
  });
}
