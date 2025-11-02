import { notFound } from 'next/navigation';
import { requireBranchAccessForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import {
  getPayments,
  getPaymentStats,
  getPaymentMethodsWithTotals,
  getSpaAccountsWithStats,
} from './queries';
import { PaymentsClient } from './components/PaymentsClient';
import type { PaymentFilters } from '@/types/payments';

interface PaymentsPageProps {
  params: Promise<{
    spaId: string;
    branchId: string;
  }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    paymentMethodId?: string;
    clientId?: string;
    manicuristId?: string;
    commissionStatus?: string;
    minAmount?: string;
    maxAmount?: string;
  }>;
}

export default async function PaymentsPage({
  params,
  searchParams,
}: PaymentsPageProps) {
  const { spaId, branchId } = await params;
  const {
    page = '1',
    limit = '10',
    search,
    dateFrom,
    dateTo,
    paymentMethodId,
    clientId,
    manicuristId,
    commissionStatus,
    minAmount,
    maxAmount,
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
  const filters: PaymentFilters = {
    search: search || undefined,
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
    paymentMethodId: paymentMethodId || undefined,
    clientId: clientId || undefined,
    manicuristId: manicuristId || undefined,
    commissionStatus:
      (commissionStatus as PaymentFilters['commissionStatus']) || 'ALL',
    minAmount: minAmount ? parseFloat(minAmount) : undefined,
    maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
  };

  // Get pagination parameters
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  // Fetch payments, stats, payment methods, spa accounts, and branches in parallel
  const [paymentsResult, stats, paymentMethods, spaAccounts, branches] =
    await Promise.all([
      getPayments({
        spaId,
        branchId,
        filters,
        page: pageNumber,
        limit: limitNumber,
      }),
      getPaymentStats({
        spaId,
        branchId,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      }),
      getPaymentMethodsWithTotals(spaId),
      getSpaAccountsWithStats(spaId),
      prisma.branch.findMany({
        where: { spaId },
        select: {
          id: true,
          name: true,
          code: true,
        },
        orderBy: { name: 'asc' },
      }),
    ]);

  // Calculate pagination info
  const totalPages = Math.ceil(paymentsResult.totalCount / limitNumber);
  const hasNextPage = pageNumber < totalPages;
  const hasPrevPage = pageNumber > 1;

  return (
    <PaymentsClient
      payments={paymentsResult.payments}
      stats={stats}
      paymentMethods={paymentMethods}
      spaAccounts={spaAccounts}
      branches={branches}
      branch={branch}
      spaId={spaId}
      branchId={branchId}
      pagination={{
        currentPage: pageNumber,
        totalPages,
        totalCount: paymentsResult.totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNumber,
      }}
      filters={filters}
    />
  );
}
