import { notFound } from 'next/navigation';
import { requireBranchAccessForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { getAppointments, getAppointmentFormData } from './queries';
import { AppointmentsClient } from './components/AppointmentsClient';
import type { AppointmentFilters } from '@/types';
import { startOfDay, endOfDay } from 'date-fns';

interface AppointmentsPageProps {
  params: Promise<{
    spaId: string;
    branchId: string;
  }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
    manicuristId?: string;
    clientId?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function AppointmentsPage({
  params,
  searchParams,
}: AppointmentsPageProps) {
  const { spaId, branchId } = await params;
  const {
    page = '1',
    limit = '10',
    status,
    manicuristId,
    clientId,
    search,
    dateFrom,
    dateTo,
  } = await searchParams;

  // Require BRANCH_ADMIN role and branch access
  await requireBranchAccessForPage(spaId, branchId);

  // Verify branch exists
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    select: { id: true, name: true, spa: { select: { name: true } } },
  });

  if (!branch) {
    notFound();
  }

  // Build filters
  // Parse dates and ensure they cover the full day using startOfDay/endOfDay
  const filters: AppointmentFilters = {
    status: (status as AppointmentFilters['status']) || 'ALL',
    manicuristId: manicuristId || undefined,
    clientId: clientId || undefined,
    search: search || undefined,
    dateFrom: dateFrom ? startOfDay(new Date(dateFrom)) : undefined,
    dateTo: dateTo ? endOfDay(new Date(dateTo)) : undefined,
  };

  // Get pagination parameters
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  // Fetch appointments and form data in parallel
  const [appointmentsResult, formData] = await Promise.all([
    getAppointments({
      spaId,
      branchId,
      filters,
      page: pageNumber,
      limit: limitNumber,
    }),
    getAppointmentFormData(spaId, branchId),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(appointmentsResult.totalCount / limitNumber);
  const hasNextPage = pageNumber < totalPages;
  const hasPrevPage = pageNumber > 1;

  return (
    <AppointmentsClient
      appointments={appointmentsResult.appointments}
      formData={formData}
      spaId={spaId}
      branchId={branchId}
      branchName={branch.name}
      pagination={{
        currentPage: pageNumber,
        totalPages,
        totalCount: appointmentsResult.totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNumber,
      }}
    />
  );
}
