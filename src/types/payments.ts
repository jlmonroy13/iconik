import { Prisma } from '@/generated/prisma';

// =====================================================
// PAYMENT TYPES
// =====================================================

/**
 * Payment with all related data for display
 */
export type PaymentWithDetails = Prisma.PaymentGetPayload<{
  include: {
    appointment: {
      include: {
        client: {
          select: {
            id: true;
            name: true;
            phone: true;
            email: true;
            documentType: true;
            documentNumber: true;
          };
        };
        services: {
          include: {
            service: {
              select: {
                id: true;
                name: true;
                price: true;
                type: true;
              };
            };
            manicurist: {
              select: {
                id: true;
                name: true;
                commission: true;
              };
            };
          };
        };
      };
    };
    appointmentService: {
      include: {
        service: {
          select: {
            id: true;
            name: true;
            type: true;
          };
        };
        manicurist: {
          select: {
            id: true;
            name: true;
            commission: true;
          };
        };
      };
    };
    paymentMethod: {
      select: {
        id: true;
        name: true;
        type: true;
        icon: true;
        transactionFee: true;
      };
    };
    commission: {
      include: {
        manicurist: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    branch: {
      select: {
        id: true;
        name: true;
        code: true;
      };
    };
    cashRegisterTransaction: {
      select: {
        id: true;
        type: true;
        amount: true;
        cashIn: true;
        cashOut: true;
      };
    };
  };
}>;

/**
 * Simplified payment for lists and tables
 */
export type PaymentListItem = {
  id: string;
  paidAt: Date;
  amount: number;
  originalAmount: number;
  discountAmount: number;
  discountReason: string | null;
  transactionFeeAmount: number;
  reference: string | null;
  client: {
    id: string;
    name: string;
    documentType: string;
    documentNumber: string;
  };
  paymentMethod: {
    id: string;
    name: string;
    type: string | null;
    icon: string | null;
  };
  commission: {
    id: string;
    manicuristId: string;
    manicuristName: string;
    commissionAmount: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
  } | null;
  appointmentId: string | null;
  servicesCount: number;
};

/**
 * Payment statistics for dashboard
 */
export type PaymentStats = {
  totalAmount: number;
  totalPayments: number;
  averagePayment: number;
  byPaymentMethod: {
    methodId: string;
    methodName: string;
    methodType: string | null;
    amount: number;
    count: number;
    percentage: number;
  }[];
  commissionsGenerated: number;
  commissionsPending: number;
  commissionsPaid: number;
  commissionsCancelled: number;
  discountsApplied: number;
  transactionFeesTotal: number;
};

/**
 * Payment filters for queries
 */
export type PaymentFilters = {
  dateFrom?: Date;
  dateTo?: Date;
  paymentMethodId?: string;
  clientId?: string;
  manicuristId?: string;
  commissionStatus?: 'PENDING' | 'PAID' | 'CANCELLED' | 'ALL';
  minAmount?: number;
  maxAmount?: number;
  search?: string;
};

/**
 * Commission breakdown details
 */
export type CommissionBreakdownData = {
  serviceAmount: number;
  commissionRate: number;
  originalCommissionAmount: number;
  discountAmount: number;
  discountAffectsCommission: boolean;
  finalCommissionAmount: number;
  spaAmount: number;
  status: string;
  manicurist: {
    id: string;
    name: string;
  };
};

/**
 * Payment method with usage stats
 */
export type PaymentMethodWithStats = {
  id: string;
  name: string;
  type: string | null;
  icon: string | null;
  isActive: boolean;
  transactionFee: number;
  _count: {
    payments: number;
  };
  totalAmount?: number;
};

// =====================================================
// PAYMENT METHOD TYPES
// =====================================================

/**
 * Payment method for forms and display
 */
export type PaymentMethodBasic = {
  id: string;
  name: string;
  type: string | null;
  icon: string | null;
  isActive: boolean;
  transactionFee: number;
};

// =====================================================
// UI TYPES
// =====================================================

/**
 * Pagination info for payments
 */
export type PaymentPaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
};

/**
 * Search params for payments page
 */
export type PaymentSearchParams = {
  search?: string;
  page?: string;
  limit?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentMethodId?: string;
  clientId?: string;
  manicuristId?: string;
  commissionStatus?: string;
  minAmount?: string;
  maxAmount?: string;
};

/**
 * Branch info for display
 */
export type PaymentBranchInfo = {
  id: string;
  name: string;
  spa: {
    name: string;
  };
};
