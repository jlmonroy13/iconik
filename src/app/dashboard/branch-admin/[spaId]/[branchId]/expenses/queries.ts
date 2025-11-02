import { prisma } from '@/lib/prisma';
import type {
  ExpenseWithDetails,
  ExpenseListItem,
  ExpenseStats,
  ExpenseFilters,
  ExpensePaymentWithDetails,
} from '@/types/expenses';

/**
 * Search and pagination parameters for expenses
 */
export interface ExpenseQueryParams {
  spaId: string;
  filters?: ExpenseFilters;
  page?: number;
  limit?: number;
}

/**
 * Result type for paginated expense queries
 */
export interface ExpenseQueryResult {
  expenses: ExpenseListItem[];
  totalCount: number;
}

/**
 * Get expenses with pagination and filters
 */
export async function getExpenses({
  spaId,
  filters = {},
  page = 1,
  limit = 10,
}: ExpenseQueryParams): Promise<ExpenseQueryResult> {
  // Build where clause for filtering
  const where: {
    spaId: string;
    type?: 'FIXED' | 'VARIABLE';
    category?:
      | 'RENT'
      | 'SALARIES'
      | 'MARKETING'
      | 'SUPPLIES'
      | 'UTILITIES'
      | 'INSURANCE'
      | 'MAINTENANCE'
      | 'EQUIPMENT'
      | 'SOFTWARE'
      | 'PROFESSIONAL'
      | 'TRAINING'
      | 'TRAVEL'
      | 'FOOD'
      | 'CLEANING'
      | 'SECURITY'
      | 'OTHER';
    frequency?: 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'ONE_TIME';
    isPaid?: boolean;
    isActive?: boolean;
    dueDate?: { gte?: Date; lte?: Date };
    name?: { contains: string; mode: 'insensitive' };
  } = {
    spaId,
  };

  // Type filter
  if (filters.type && filters.type !== 'ALL') {
    where.type = filters.type;
  }

  // Category filter
  if (filters.category && filters.category !== 'ALL') {
    where.category = filters.category;
  }

  // Frequency filter
  if (filters.frequency && filters.frequency !== 'ALL') {
    where.frequency = filters.frequency;
  }

  // isPaid filter
  if (typeof filters.isPaid === 'boolean') {
    where.isPaid = filters.isPaid;
  }

  // isActive filter
  if (typeof filters.isActive === 'boolean') {
    where.isActive = filters.isActive;
  }

  // Date range filter
  if (filters.dateFrom || filters.dateTo) {
    where.dueDate = {};
    if (filters.dateFrom) {
      where.dueDate.gte = filters.dateFrom;
    }
    if (filters.dateTo) {
      where.dueDate.lte = filters.dateTo;
    }
  }

  // Search filter
  if (filters.search) {
    where.name = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }

  // Calculate offset for pagination
  const skip = (page - 1) * limit;

  // Get total count
  const totalCount = await prisma.expense.count({ where });

  // Get expenses with payments
  const expenses = await prisma.expense.findMany({
    where,
    include: {
      payments: {
        select: {
          amount: true,
        },
      },
    },
    orderBy: [{ isPaid: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
    skip,
    take: limit,
  });

  // Transform to ExpenseListItem
  const expenseItems: ExpenseListItem[] = expenses.map(expense => {
    const totalPaid = expense.payments.reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = expense.amount - totalPaid;

    return {
      id: expense.id,
      name: expense.name,
      description: expense.description,
      amount: expense.amount,
      type: expense.type,
      category: expense.category,
      frequency: expense.frequency,
      dueDate: expense.dueDate,
      paidAt: expense.paidAt,
      isPaid: expense.isPaid,
      isActive: expense.isActive,
      totalPaid,
      remainingAmount,
      paymentsCount: expense.payments.length,
    };
  });

  return {
    expenses: expenseItems,
    totalCount,
  };
}

/**
 * Get single expense with full details
 */
export async function getExpenseById(
  expenseId: string
): Promise<ExpenseWithDetails | null> {
  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    include: {
      spa: {
        select: {
          id: true,
          name: true,
        },
      },
      payments: {
        include: {
          spaAccount: {
            select: {
              id: true,
              name: true,
              type: true,
              bank: true,
            },
          },
        },
        orderBy: { paidAt: 'desc' },
      },
    },
  });

  return expense;
}

/**
 * Get expense statistics for a spa
 */
export async function getExpenseStats(params: {
  spaId: string;
  dateFrom?: Date;
  dateTo?: Date;
}): Promise<ExpenseStats> {
  const { spaId, dateFrom, dateTo } = params;

  // Build where clause
  const where: {
    spaId: string;
    dueDate?: { gte?: Date; lte?: Date };
  } = { spaId };

  if (dateFrom || dateTo) {
    where.dueDate = {};
    if (dateFrom) where.dueDate.gte = dateFrom;
    if (dateTo) where.dueDate.lte = dateTo;
  }

  // Get all expenses with payments
  const expenses = await prisma.expense.findMany({
    where,
    include: {
      payments: {
        select: {
          amount: true,
        },
      },
    },
  });

  // Calculate totals
  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const paidExpenses = expenses.filter(e => e.isPaid);
  const paidAmount = paidExpenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  // Calculate overdue
  const now = new Date();
  const overdueExpenses = expenses.filter(
    e => !e.isPaid && e.dueDate && e.dueDate < now
  );
  const overdueAmount = overdueExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by type
  const typeGroups = expenses.reduce(
    (acc, expense) => {
      const existing = acc.find(g => g.type === expense.type);
      if (existing) {
        existing.count++;
        existing.amount += expense.amount;
      } else {
        acc.push({
          type: expense.type,
          count: 1,
          amount: expense.amount,
          percentage: 0,
        });
      }
      return acc;
    },
    [] as ExpenseStats['byType']
  );

  // Calculate percentages
  typeGroups.forEach(g => {
    g.percentage = totalAmount > 0 ? (g.amount / totalAmount) * 100 : 0;
  });

  // Group by category
  const categoryGroups = expenses.reduce(
    (acc, expense) => {
      const existing = acc.find(g => g.category === expense.category);
      if (existing) {
        existing.count++;
        existing.amount += expense.amount;
      } else {
        acc.push({
          category: expense.category,
          count: 1,
          amount: expense.amount,
          percentage: 0,
        });
      }
      return acc;
    },
    [] as ExpenseStats['byCategory']
  );

  // Calculate percentages
  categoryGroups.forEach(g => {
    g.percentage = totalAmount > 0 ? (g.amount / totalAmount) * 100 : 0;
  });

  // Sort by amount
  categoryGroups.sort((a, b) => b.amount - a.amount);

  // Group by frequency
  const frequencyGroups = expenses.reduce(
    (acc, expense) => {
      const existing = acc.find(g => g.frequency === expense.frequency);
      if (existing) {
        existing.count++;
        existing.amount += expense.amount;
      } else {
        acc.push({
          frequency: expense.frequency,
          count: 1,
          amount: expense.amount,
        });
      }
      return acc;
    },
    [] as ExpenseStats['byFrequency']
  );

  // Get upcoming expenses (next 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const upcoming = expenses
    .filter(
      e =>
        !e.isPaid &&
        e.dueDate &&
        e.dueDate >= now &&
        e.dueDate <= thirtyDaysFromNow
    )
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
    .slice(0, 5)
    .map(e => ({
      name: e.name,
      amount: e.amount,
      dueDate: e.dueDate!,
      category: e.category,
    }));

  // Get overdue expenses (sorted by oldest first)
  const overdue = overdueExpenses
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
    .slice(0, 5)
    .map(e => ({
      name: e.name,
      amount: e.amount,
      dueDate: e.dueDate!,
      category: e.category,
      daysOverdue: Math.floor(
        (now.getTime() - e.dueDate!.getTime()) / (1000 * 60 * 60 * 24)
      ),
    }));

  return {
    totalExpenses,
    totalAmount,
    paidAmount,
    pendingAmount,
    overdueAmount,
    byType: typeGroups,
    byCategory: categoryGroups,
    byFrequency: frequencyGroups,
    upcoming,
    overdue,
  };
}

/**
 * Get expense payments for a specific expense
 */
export async function getExpensePayments(
  expenseId: string
): Promise<ExpensePaymentWithDetails[]> {
  const payments = await prisma.expensePayment.findMany({
    where: { expenseId },
    include: {
      expense: {
        select: {
          id: true,
          name: true,
          amount: true,
          category: true,
        },
      },
      spaAccount: {
        select: {
          id: true,
          name: true,
          type: true,
          bank: true,
        },
      },
    },
    orderBy: { paidAt: 'desc' },
  });

  return payments;
}
