import { redirect } from 'next/navigation';
import { auth } from '@/../../auth';
import { canAccessSpa } from '@/lib/auth-utils';
import { getManicurists } from './queries';
import { getAllActiveServices } from '../services/queries';
import { ManicuristsClient } from './components/ManicuristsClient';
import type { ManicuristSearchParams } from '@/types/manicurists';

interface ManicuristsPageProps {
  params: Promise<{ spaId: string; branchId: string }>;
  searchParams: Promise<ManicuristSearchParams>;
}

export default async function ManicuristsPage({
  params,
  searchParams,
}: ManicuristsPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const { spaId, branchId } = await params;
  const hasAccess = await canAccessSpa(spaId);
  if (!hasAccess) {
    redirect('/dashboard');
  }

  const filters = await searchParams;

  // Fetch manicurists with pagination
  const result = await getManicurists({
    spaId,
    branchId,
    search: filters.search,
    page: filters.page ? parseInt(filters.page) : 1,
    limit: filters.limit ? parseInt(filters.limit) : 10,
  });

  // Fetch services for display
  const allServices = await getAllActiveServices(spaId, branchId);

  // Calculate pagination info
  const pagination = {
    currentPage: filters.page ? parseInt(filters.page) : 1,
    totalPages: Math.ceil(
      result.totalCount / (filters.limit ? parseInt(filters.limit) : 10)
    ),
    totalCount: result.totalCount,
    hasNextPage:
      (filters.page ? parseInt(filters.page) : 1) <
      Math.ceil(
        result.totalCount / (filters.limit ? parseInt(filters.limit) : 10)
      ),
    hasPrevPage: (filters.page ? parseInt(filters.page) : 1) > 1,
    limit: filters.limit ? parseInt(filters.limit) : 10,
  };

  // Calculate stats
  const stats = {
    total: result.totalCount,
    active: result.manicurists.filter(m => m.isActive).length,
    inactive: result.manicurists.filter(m => !m.isActive).length,
    withServices: result.manicurists.filter(
      m => m._count.manicuristServices > 0
    ).length,
  };

  return (
    <ManicuristsClient
      manicurists={result.manicurists}
      pagination={pagination}
      searchParams={filters}
      spaId={spaId}
      branchId={branchId}
      totalServicesCount={allServices.length}
      stats={stats}
    />
  );
}
