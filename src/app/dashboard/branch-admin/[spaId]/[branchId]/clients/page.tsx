import { notFound } from 'next/navigation';
import { requireBranchAccessForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { getClients } from './queries';
import { ClientsClient } from './components/ClientsClient';

interface ClientsPageProps {
  params: Promise<{
    spaId: string;
    branchId: string;
  }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ClientsPage({
  params,
  searchParams,
}: ClientsPageProps) {
  const { spaId, branchId } = await params;
  const { search, page = '1', limit = '10' } = await searchParams;

  // Require BRANCH_ADMIN role and branch access
  const user = await requireBranchAccessForPage(spaId, branchId);

  // Verify branch exists
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    select: { id: true, name: true, spa: { select: { name: true } } },
  });

  if (!branch) {
    notFound();
  }

  // Get pagination parameters
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  // Fetch clients with pagination
  const result = await getClients({
    spaId,
    branchId,
    search,
    page: pageNumber,
    limit: limitNumber,
  });

  // Calculate pagination info
  const totalPages = Math.ceil(result.totalCount / limitNumber);
  const hasNextPage = pageNumber < totalPages;
  const hasPrevPage = pageNumber > 1;

  return (
    <ClientsClient
      clients={result.clients}
      branch={branch}
      spaId={spaId}
      branchId={branchId}
      pagination={{
        currentPage: pageNumber,
        totalPages,
        totalCount: result.totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNumber,
      }}
      searchParams={{ search, page, limit }}
      currentUserId={user.id}
    />
  );
}
