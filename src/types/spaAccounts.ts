import { Prisma } from '@/generated/prisma';

// =====================================================
// SPA ACCOUNT TYPES
// =====================================================

/**
 * Account types for SpaAccount
 */
export type AccountType =
  | 'BANK_ACCOUNT'
  | 'CASH'
  | 'DIGITAL_WALLET'
  | 'CREDIT_CARD';

/**
 * SpaAccount with basic information
 */
export type SpaAccountBasic = {
  id: string;
  name: string;
  description: string | null;
  type: AccountType;
  bank: string | null;
  accountNumber: string | null;
  balance: number;
  currency: string;
  isActive: boolean;
  spaId: string;
  branchId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * SpaAccount with usage statistics
 */
export type SpaAccountWithStats = SpaAccountBasic & {
  _count: {
    paymentsReceived: number;
    expensePayments: number;
  };
  totalReceived?: number;
  totalPaid?: number;
  netBalance?: number;
};

/**
 * SpaAccount with full details including relations
 */
export type SpaAccountWithDetails = Prisma.SpaAccountGetPayload<{
  include: {
    spa: {
      select: {
        id: true;
        name: true;
      };
    };
    branch: {
      select: {
        id: true;
        name: true;
        code: true;
      };
    };
    _count: {
      select: {
        paymentsReceived: true;
        expensePayments: true;
      };
    };
  };
}>;

/**
 * Simplified SpaAccount for dropdowns/selects
 */
export type SpaAccountDropdown = {
  id: string;
  name: string;
  type: AccountType;
  bank: string | null;
  accountNumber: string | null;
  balance: number;
  isActive: boolean;
};

/**
 * SpaAccount filters for queries
 */
export type SpaAccountFilters = {
  type?: AccountType | 'ALL';
  branchId?: string;
  isActive?: boolean;
  search?: string;
};

/**
 * SpaAccount statistics for dashboard
 */
export type SpaAccountStats = {
  totalAccounts: number;
  activeAccounts: number;
  inactiveAccounts: number;
  totalBalance: number;
  byType: {
    type: AccountType;
    count: number;
    totalBalance: number;
    percentage: number;
  }[];
  byBranch?: {
    branchId: string;
    branchName: string;
    count: number;
    totalBalance: number;
  }[];
};
