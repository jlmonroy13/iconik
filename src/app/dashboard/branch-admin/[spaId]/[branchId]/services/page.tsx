import { notFound } from 'next/navigation';
import { requireBranchAccessForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { ServicesClient } from './components/ServicesClient';
import type {
  ServiceWithBranch,
  ServicePaginationInfo,
} from '@/types/services';
import { ServiceType } from '@/lib/prisma';

interface ServicesPageProps {
  params: Promise<{
    spaId: string;
    branchId: string;
  }>;
  searchParams: Promise<{
    search?: string;
    type?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ServicesPage({
  params,
  searchParams,
}: ServicesPageProps) {
  const { spaId, branchId } = await params;
  const { search, type, page = '1', limit = '10' } = await searchParams;

  // Require BRANCH_ADMIN role and branch access
  const _user = await requireBranchAccessForPage(spaId, branchId);

  // Verify branch exists
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    select: { id: true, name: true, spa: { select: { name: true } } },
  });

  if (!branch) {
    notFound();
  }

  // Build where clause for filtering
  const where = {
    spaId,
    branchId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(type && { type: type as ServiceType }),
  };

  // Get pagination parameters
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch services with pagination
  const [servicesData, totalCount] = await Promise.all([
    prisma.service.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { name: 'asc' },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    }),
    prisma.service.count({ where }),
  ]);

  // Transform to match the expected type
  const services: ServiceWithBranch[] = servicesData.map(service => ({
    ...service,
    branch: service.branch,
  }));

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNumber);
  const hasNextPage = pageNumber < totalPages;
  const hasPrevPage = pageNumber > 1;

  const pagination: ServicePaginationInfo = {
    currentPage: pageNumber,
    totalPages,
    totalCount,
    hasNextPage,
    hasPrevPage,
    limit: limitNumber,
  };

  return (
    <ServicesClient
      services={services}
      pagination={pagination}
      spaId={spaId}
      branchId={branchId}
    />
  );
}
