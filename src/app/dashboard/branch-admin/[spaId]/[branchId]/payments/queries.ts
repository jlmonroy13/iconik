import { prisma } from '@/lib/prisma';
import type {
  PaymentWithDetails,
  PaymentListItem,
  PaymentStats,
  PaymentFilters,
  PaymentMethodWithStats,
} from '@/types/payments';

/**
 * Search and pagination parameters for payments
 */
export interface PaymentQueryParams {
  spaId: string;
  branchId: string;
  filters?: PaymentFilters;
  page?: number;
  limit?: number;
}

/**
 * Result type for paginated payment queries
 */
export interface PaymentQueryResult {
  payments: PaymentListItem[];
  totalCount: number;
}

/**
 * Get payments with pagination and filters
 */
export async function getPayments({
  spaId,
  branchId,
  filters = {},
  page = 1,
  limit = 10,
}: PaymentQueryParams): Promise<PaymentQueryResult> {
  // Build where clause for filtering
  const where: {
    spaId: string;
    branchId: string;
    paidAt?: { gte?: Date; lte?: Date };
    paymentMethodId?: string;
    amount?: { gte?: number; lte?: number };
    appointment?: {
      clientId?: string;
      services?: {
        some?: {
          manicuristId?: string;
        };
      };
    };
    commission?: {
      status?: string;
    };
    OR?: Array<{
      reference?: { contains: string; mode: 'insensitive' };
      appointment?: {
        client?: {
          OR?: Array<{
            name?: { contains: string; mode: 'insensitive' };
            documentNumber?: { contains: string; mode: 'insensitive' };
          }>;
        };
      };
    }>;
  } = {
    spaId,
    branchId,
  };

  // Date range filter
  if (filters.dateFrom || filters.dateTo) {
    where.paidAt = {};
    if (filters.dateFrom) where.paidAt.gte = filters.dateFrom;
    if (filters.dateTo) where.paidAt.lte = filters.dateTo;
  }

  // Payment method filter
  if (filters.paymentMethodId) {
    where.paymentMethodId = filters.paymentMethodId;
  }

  // Amount range filter
  if (filters.minAmount || filters.maxAmount) {
    where.amount = {};
    if (filters.minAmount) where.amount.gte = filters.minAmount;
    if (filters.maxAmount) where.amount.lte = filters.maxAmount;
  }

  // Client filter
  if (filters.clientId) {
    where.appointment = {
      ...where.appointment,
      clientId: filters.clientId,
    };
  }

  // Manicurist filter
  if (filters.manicuristId) {
    where.appointment = {
      ...where.appointment,
      services: {
        some: {
          manicuristId: filters.manicuristId,
        },
      },
    };
  }

  // Commission status filter
  if (filters.commissionStatus && filters.commissionStatus !== 'ALL') {
    where.commission = {
      status: filters.commissionStatus,
    };
  }

  // Search filter (reference, client name, or document)
  if (filters.search) {
    where.OR = [
      { reference: { contains: filters.search, mode: 'insensitive' } },
      {
        appointment: {
          client: {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              {
                documentNumber: {
                  contains: filters.search,
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      },
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Fetch payments with pagination
  const [paymentsData, totalCount] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { paidAt: 'desc' },
      include: {
        appointment: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                documentType: true,
                documentNumber: true,
              },
            },
            services: {
              select: {
                id: true,
              },
            },
          },
        },
        paymentMethod: {
          select: {
            id: true,
            name: true,
            type: true,
            icon: true,
          },
        },
        commission: {
          include: {
            manicurist: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.payment.count({ where }),
  ]);

  // Transform to match the expected type
  const payments: PaymentListItem[] = paymentsData.map(payment => ({
    id: payment.id,
    paidAt: payment.paidAt,
    amount: payment.amount,
    originalAmount: payment.originalAmount,
    discountAmount: payment.discountAmount,
    discountReason: payment.discountReason,
    transactionFeeAmount: payment.transactionFeeAmount,
    reference: payment.reference,
    client: {
      id: payment.appointment?.client.id || '',
      name: payment.appointment?.client.name || 'N/A',
      documentType: payment.appointment?.client.documentType || '',
      documentNumber: payment.appointment?.client.documentNumber || '',
    },
    paymentMethod: {
      id: payment.paymentMethod.id,
      name: payment.paymentMethod.name,
      type: payment.paymentMethod.type,
      icon: payment.paymentMethod.icon,
    },
    commission: payment.commission
      ? {
          id: payment.commission.id,
          manicuristId: payment.commission.manicuristId,
          manicuristName: payment.commission.manicurist.name,
          commissionAmount: payment.commission.commissionAmount,
          status: payment.commission.status,
        }
      : null,
    appointmentId: payment.appointmentId,
    servicesCount: payment.appointment?.services.length || 0,
  }));

  return {
    payments,
    totalCount,
  };
}

/**
 * Get payment statistics for dashboard
 */
export async function getPaymentStats({
  spaId,
  branchId,
  dateFrom,
  dateTo,
}: {
  spaId: string;
  branchId: string;
  dateFrom?: Date;
  dateTo?: Date;
}): Promise<PaymentStats> {
  // Build date filter
  const dateFilter =
    dateFrom || dateTo
      ? {
          paidAt: {
            ...(dateFrom && { gte: dateFrom }),
            ...(dateTo && { lte: dateTo }),
          },
        }
      : {};

  // Fetch all payments with their details
  const payments = await prisma.payment.findMany({
    where: {
      spaId,
      branchId,
      ...dateFilter,
    },
    include: {
      paymentMethod: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },
      commission: {
        select: {
          commissionAmount: true,
          status: true,
        },
      },
    },
  });

  // Calculate totals
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPayments = payments.length;
  const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

  // Calculate by payment method
  const methodMap = new Map<
    string,
    { name: string; type: string | null; amount: number; count: number }
  >();

  payments.forEach(payment => {
    const methodId = payment.paymentMethod.id;
    const current = methodMap.get(methodId);
    if (current) {
      current.amount += payment.amount;
      current.count++;
    } else {
      methodMap.set(methodId, {
        name: payment.paymentMethod.name,
        type: payment.paymentMethod.type,
        amount: payment.amount,
        count: 1,
      });
    }
  });

  const byPaymentMethod = Array.from(methodMap.entries()).map(
    ([methodId, data]) => ({
      methodId,
      methodName: data.name,
      methodType: data.type,
      amount: data.amount,
      count: data.count,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
    })
  );

  // Calculate commission stats
  const commissionsGenerated = payments.reduce(
    (sum, p) => sum + (p.commission?.commissionAmount || 0),
    0
  );

  const commissionsPending = payments
    .filter(p => p.commission?.status === 'PENDING')
    .reduce((sum, p) => sum + (p.commission?.commissionAmount || 0), 0);

  const commissionsPaid = payments
    .filter(p => p.commission?.status === 'PAID')
    .reduce((sum, p) => sum + (p.commission?.commissionAmount || 0), 0);

  const commissionsCancelled = payments
    .filter(p => p.commission?.status === 'CANCELLED')
    .reduce((sum, p) => sum + (p.commission?.commissionAmount || 0), 0);

  // Calculate discount and fee totals
  const discountsApplied = payments.reduce(
    (sum, p) => sum + p.discountAmount,
    0
  );

  const transactionFeesTotal = payments.reduce(
    (sum, p) => sum + p.transactionFeeAmount,
    0
  );

  return {
    totalAmount,
    totalPayments,
    averagePayment,
    byPaymentMethod,
    commissionsGenerated,
    commissionsPending,
    commissionsPaid,
    commissionsCancelled,
    discountsApplied,
    transactionFeesTotal,
  };
}

/**
 * Get a single payment by ID with full details
 */
export async function getPaymentById(
  paymentId: string
): Promise<PaymentWithDetails | null> {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      appointment: {
        include: {
          client: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              documentType: true,
              documentNumber: true,
            },
          },
          services: {
            include: {
              service: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  type: true,
                },
              },
              manicurist: {
                select: {
                  id: true,
                  name: true,
                  commission: true,
                },
              },
            },
          },
        },
      },
      appointmentService: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          manicurist: {
            select: {
              id: true,
              name: true,
              commission: true,
            },
          },
        },
      },
      paymentMethod: {
        select: {
          id: true,
          name: true,
          type: true,
          icon: true,
          transactionFee: true,
        },
      },
      commission: {
        include: {
          manicurist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      cashRegisterTransaction: {
        select: {
          id: true,
          type: true,
          amount: true,
          cashIn: true,
          cashOut: true,
        },
      },
    },
  });

  return payment;
}

/**
 * Get all active payment methods for a spa
 */
export async function getPaymentMethods(
  spaId: string
): Promise<PaymentMethodWithStats[]> {
  const methods = await prisma.paymentMethod.findMany({
    where: { spaId },
    include: {
      _count: {
        select: {
          payments: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return methods;
}

/**
 * Get active payment methods only (for filters and forms)
 */
export async function getActivePaymentMethods(
  spaId: string
): Promise<PaymentMethodWithStats[]> {
  const methods = await prisma.paymentMethod.findMany({
    where: {
      spaId,
      isActive: true,
    },
    include: {
      _count: {
        select: {
          payments: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return methods;
}

/**
 * Get all payment methods with total amounts (for management page)
 */
export async function getPaymentMethodsWithTotals(
  spaId: string
): Promise<PaymentMethodWithStats[]> {
  // Get all payment methods
  const methods = await prisma.paymentMethod.findMany({
    where: { spaId },
    include: {
      _count: {
        select: {
          payments: true,
        },
      },
      payments: {
        select: {
          amount: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  // Calculate total amounts
  return methods.map(method => {
    const totalAmount = method.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Remove payments from the returned object
    const { payments: _payments, ...methodWithoutPayments } = method;

    return {
      ...methodWithoutPayments,
      totalAmount,
    };
  });
}

// =====================================================
// SPA ACCOUNTS QUERIES
// =====================================================

/**
 * Get all spa accounts for a spa
 */
export async function getSpaAccounts(spaId: string) {
  const accounts = await prisma.spaAccount.findMany({
    where: { spaId },
    include: {
      branch: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      _count: {
        select: {
          paymentsReceived: true,
          expensePayments: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return accounts;
}

/**
 * Get spa accounts with statistics
 */
export async function getSpaAccountsWithStats(spaId: string) {
  const accounts = await prisma.spaAccount.findMany({
    where: { spaId },
    include: {
      branch: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      _count: {
        select: {
          paymentsReceived: true,
          expensePayments: true,
        },
      },
      paymentsReceived: {
        select: {
          amount: true,
        },
      },
      expensePayments: {
        select: {
          amount: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  // Calculate totals
  return accounts.map(account => {
    const totalReceived = account.paymentsReceived.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const totalPaid = account.expensePayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const netBalance = totalReceived - totalPaid;

    // Remove raw payment arrays
    const {
      paymentsReceived: _received,
      expensePayments: _paid,
      ...accountWithoutPayments
    } = account;

    return {
      ...accountWithoutPayments,
      totalReceived,
      totalPaid,
      netBalance,
    };
  });
}

/**
 * Get active spa accounts for dropdowns
 */
export async function getActiveSpaAccounts(spaId: string) {
  const accounts = await prisma.spaAccount.findMany({
    where: {
      spaId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      type: true,
      bank: true,
      accountNumber: true,
      balance: true,
      isActive: true,
    },
    orderBy: { name: 'asc' },
  });

  return accounts;
}

/**
 * Get single spa account by ID
 */
export async function getSpaAccountById(accountId: string) {
  const account = await prisma.spaAccount.findUnique({
    where: { id: accountId },
    include: {
      spa: {
        select: {
          id: true,
          name: true,
        },
      },
      branch: {
        select: {
          id: true,
          name: true,
          code: true,
        },
      },
      _count: {
        select: {
          paymentsReceived: true,
          expensePayments: true,
        },
      },
    },
  });

  return account;
}
