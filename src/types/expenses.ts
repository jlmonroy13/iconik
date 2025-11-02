import { Prisma } from '@/generated/prisma';

// =====================================================
// EXPENSE TYPES
// =====================================================

/**
 * Expense type enum
 */
export type ExpenseType = 'FIXED' | 'VARIABLE';

/**
 * Expense category enum
 */
export type ExpenseCategory =
  | 'RENT' // Arriendo
  | 'SALARIES' // Sueldos
  | 'MARKETING' // Marketing y publicidad
  | 'SUPPLIES' // Suministros
  | 'UTILITIES' // Servicios públicos
  | 'INSURANCE' // Seguros
  | 'MAINTENANCE' // Mantenimiento
  | 'EQUIPMENT' // Equipos
  | 'SOFTWARE' // Software y tecnología
  | 'PROFESSIONAL' // Servicios profesionales
  | 'TRAINING' // Capacitación
  | 'TRAVEL' // Viajes
  | 'FOOD' // Alimentación
  | 'CLEANING' // Limpieza
  | 'SECURITY' // Seguridad
  | 'OTHER'; // Otros

/**
 * Expense frequency enum
 */
export type ExpenseFrequency = 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'ONE_TIME';

/**
 * Basic expense information
 */
export type ExpenseBasic = {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  type: ExpenseType;
  category: ExpenseCategory;
  frequency: ExpenseFrequency;
  dueDate: Date | null;
  paidAt: Date | null;
  isPaid: boolean;
  isActive: boolean;
  spaId: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Expense with payment details
 */
export type ExpenseWithPayments = Prisma.ExpenseGetPayload<{
  include: {
    payments: {
      include: {
        spaAccount: {
          select: {
            id: true;
            name: true;
            type: true;
          };
        };
      };
    };
  };
}>;

/**
 * Expense with full details
 */
export type ExpenseWithDetails = Prisma.ExpenseGetPayload<{
  include: {
    spa: {
      select: {
        id: true;
        name: true;
      };
    };
    payments: {
      include: {
        spaAccount: {
          select: {
            id: true;
            name: true;
            type: true;
            bank: true;
          };
        };
      };
    };
  };
}>;

/**
 * ExpensePayment with details
 */
export type ExpensePaymentWithDetails = Prisma.ExpensePaymentGetPayload<{
  include: {
    expense: {
      select: {
        id: true;
        name: true;
        amount: true;
        category: true;
      };
    };
    spaAccount: {
      select: {
        id: true;
        name: true;
        type: true;
        bank: true;
      };
    };
  };
}>;

/**
 * Expense list item for tables
 */
export type ExpenseListItem = {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  type: ExpenseType;
  category: ExpenseCategory;
  frequency: ExpenseFrequency;
  dueDate: Date | null;
  paidAt: Date | null;
  isPaid: boolean;
  isActive: boolean;
  totalPaid: number;
  remainingAmount: number;
  paymentsCount: number;
};

/**
 * Expense filters for queries
 */
export type ExpenseFilters = {
  type?: ExpenseType | 'ALL';
  category?: ExpenseCategory | 'ALL';
  frequency?: ExpenseFrequency | 'ALL';
  isPaid?: boolean | 'ALL';
  isActive?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
};

/**
 * Expense statistics for dashboard
 */
export type ExpenseStats = {
  totalExpenses: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  byType: {
    type: ExpenseType;
    count: number;
    amount: number;
    percentage: number;
  }[];
  byCategory: {
    category: ExpenseCategory;
    count: number;
    amount: number;
    percentage: number;
  }[];
  byFrequency: {
    frequency: ExpenseFrequency;
    count: number;
    amount: number;
  }[];
  upcoming: {
    name: string;
    amount: number;
    dueDate: Date;
    category: ExpenseCategory;
  }[];
  overdue: {
    name: string;
    amount: number;
    dueDate: Date;
    category: ExpenseCategory;
    daysOverdue: number;
  }[];
};

/**
 * Category labels in Spanish
 */
export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  RENT: 'Arriendo',
  SALARIES: 'Sueldos',
  MARKETING: 'Marketing',
  SUPPLIES: 'Suministros',
  UTILITIES: 'Servicios Públicos',
  INSURANCE: 'Seguros',
  MAINTENANCE: 'Mantenimiento',
  EQUIPMENT: 'Equipos',
  SOFTWARE: 'Software',
  PROFESSIONAL: 'Servicios Profesionales',
  TRAINING: 'Capacitación',
  TRAVEL: 'Viajes',
  FOOD: 'Alimentación',
  CLEANING: 'Limpieza',
  SECURITY: 'Seguridad',
  OTHER: 'Otros',
};

/**
 * Type labels in Spanish
 */
export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  FIXED: 'Fijo',
  VARIABLE: 'Variable',
};

/**
 * Frequency labels in Spanish
 */
export const EXPENSE_FREQUENCY_LABELS: Record<ExpenseFrequency, string> = {
  MONTHLY: 'Mensual',
  WEEKLY: 'Semanal',
  DAILY: 'Diario',
  ONE_TIME: 'Único',
};

/**
 * Account type labels in Spanish
 */
export const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  BANK_ACCOUNT: 'Cuenta Bancaria',
  CASH: 'Efectivo',
  DIGITAL_WALLET: 'Billetera Digital',
  CREDIT_CARD: 'Tarjeta de Crédito',
};
