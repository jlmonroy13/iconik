import { notFound } from 'next/navigation';
import { requireBranchAccessForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { ClientsClient } from './components/ClientsClient';
import type { ClientWithAppointmentCount } from '@/types/clients';

interface ClientsPageProps {
  params: {
    spaId: string;
    branchId: string;
  };
  searchParams: {
    search?: string;
    page?: string;
    limit?: string;
  };
}

export default async function ClientsPage({
  params,
  searchParams,
}: ClientsPageProps) {
  const { spaId, branchId } = params;
  const { search, page = '1', limit = '10' } = searchParams;

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
        { email: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search, mode: 'insensitive' as const } },
        { documentNumber: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  // Get pagination parameters
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch clients with pagination
  const [clientsData, totalCount] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        documentType: true,
        documentNumber: true,
        phone: true,
        email: true,
        birthday: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            appointments: true,
          },
        },
      },
    }),
    prisma.client.count({ where }),
  ]);

  // Transform to match the expected type
  const clients: ClientWithAppointmentCount[] = clientsData.map(client => ({
    ...client,
    _count: {
      appointments: client._count.appointments,
    },
  }));

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNumber);
  const hasNextPage = pageNumber < totalPages;
  const hasPrevPage = pageNumber > 1;

  return (
    <ClientsClient
      clients={clients}
      branch={branch}
      spaId={spaId}
      branchId={branchId}
      pagination={{
        currentPage: pageNumber,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNumber,
      }}
      searchParams={searchParams}
    />
  );
}
