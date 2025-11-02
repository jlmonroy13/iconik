import { notFound } from 'next/navigation';
import { requireBranchAccessForPage } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { getExpenses, getExpenseStats } from './queries';
import { getActiveSpaAccounts } from '../payments/queries';
import { ExpensesClient } from './components/ExpensesClient';
import type { ExpenseFilters } from '@/types/expenses';

interface ExpensesPageProps {
  params: Promise<{
    spaId: string;
    branchId: string;
  }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    type?: string;
    category?: string;
    frequency?: string;
    isPaid?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function ExpensesPage({
  params,
  searchParams,
}: ExpensesPageProps) {
  const { spaId, branchId } = await params;
  const {
    page = '1',
    limit = '10',
    search,
    type,
    category,
    frequency,
    isPaid,
    dateFrom,
    dateTo,
  } = await searchParams;

  // Require BRANCH_ADMIN role and branch access
  await requireBranchAccessForPage(spaId, branchId);

  // Verify branch exists
  const branch = await prisma.branch.findUnique({
    where: { id: branchId },
    select: { id: true, name: true },
  });

  if (!branch) {
    notFound();
  }

  // Build filters
  const filters: ExpenseFilters = {
    search: search || undefined,
    type: type && type !== 'ALL' ? (type as 'FIXED' | 'VARIABLE') : undefined,
    category:
      category && category !== 'ALL'
        ? (category as ExpenseFilters['category'])
        : undefined,
    frequency:
      frequency && frequency !== 'ALL'
        ? (frequency as 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'ONE_TIME')
        : undefined,
    isPaid: isPaid === 'true' ? true : isPaid === 'false' ? false : undefined,
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
    isActive: true, // Only show active expenses by default
  };

  // Get pagination parameters
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  // Fetch expenses, stats, and spa accounts in parallel
  const [expensesResult, stats, spaAccounts] = await Promise.all([
    getExpenses({
      spaId,
      filters,
      page: pageNumber,
      limit: limitNumber,
    }),
    getExpenseStats({
      spaId,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    }),
    getActiveSpaAccounts(spaId),
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(expensesResult.totalCount / limitNumber);
  const hasNextPage = pageNumber < totalPages;
  const hasPrevPage = pageNumber > 1;

  return (
    <ExpensesClient
      expenses={expensesResult.expenses}
      stats={stats}
      spaAccounts={spaAccounts}
      spaId={spaId}
      branchId={branchId}
      pagination={{
        currentPage: pageNumber,
        totalPages,
        totalCount: expensesResult.totalCount,
        hasNextPage,
        hasPrevPage,
        limit: limitNumber,
      }}
      filters={filters}
    />
  );
}
