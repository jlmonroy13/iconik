// Expense category labels
export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  RENT: 'Arriendo',
  SALARIES: 'Sueldos',
  MARKETING: 'Marketing',
  SUPPLIES: 'Suministros',
  UTILITIES: 'Servicios públicos',
  INSURANCE: 'Seguros',
  MAINTENANCE: 'Mantenimiento',
  EQUIPMENT: 'Equipos',
  SOFTWARE: 'Software',
  PROFESSIONAL: 'Servicios profesionales',
  TRAINING: 'Capacitación',
  TRAVEL: 'Viajes',
  FOOD: 'Alimentación',
  CLEANING: 'Limpieza',
  SECURITY: 'Seguridad',
  OTHER: 'Otros',
};

// Expense frequency labels
export const EXPENSE_FREQUENCY_LABELS: Record<string, string> = {
  MONTHLY: 'Mensual',
  WEEKLY: 'Semanal',
  DAILY: 'Diario',
  ONE_TIME: 'Una vez',
};

// Expense type labels
export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  FIXED: 'Fijo',
  VARIABLE: 'Variable',
};

/**
 * Get expense category label
 */
export function getExpenseCategoryLabel(category: string): string {
  return EXPENSE_CATEGORY_LABELS[category] || category;
}

/**
 * Get expense frequency label
 */
export function getExpenseFrequencyLabel(frequency: string): string {
  return EXPENSE_FREQUENCY_LABELS[frequency] || frequency;
}

/**
 * Get expense type label
 */
export function getExpenseTypeLabel(type: string): string {
  return EXPENSE_TYPE_LABELS[type] || type;
}

/**
 * Calculate monthly expense amount based on frequency
 */
export function calculateMonthlyExpenseAmount(
  amount: number,
  frequency: string
): number {
  switch (frequency) {
    case 'DAILY':
      return amount * 30;
    case 'WEEKLY':
      return amount * 4.33; // Average weeks per month
    case 'MONTHLY':
      return amount;
    case 'ONE_TIME':
      return amount / 12; // Distribute one-time expenses over a year
    default:
      return amount;
  }
}

/**
 * Calculate annual expense amount based on frequency
 */
export function calculateAnnualExpenseAmount(
  amount: number,
  frequency: string
): number {
  switch (frequency) {
    case 'DAILY':
      return amount * 365;
    case 'WEEKLY':
      return amount * 52;
    case 'MONTHLY':
      return amount * 12;
    case 'ONE_TIME':
      return amount;
    default:
      return amount;
  }
}

/**
 * Check if expense is overdue
 */
export function isExpenseOverdue(dueDate: Date, isPaid: boolean): boolean {
  if (isPaid) return false;
  return new Date() > dueDate;
}

/**
 * Get days until due date
 */
export function getDaysUntilDue(dueDate: Date): number {
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format expense status
 */
export function getExpenseStatus(
  dueDate: Date,
  isPaid: boolean
): {
  status: 'PAID' | 'OVERDUE' | 'DUE_SOON' | 'UPCOMING';
  label: string;
  color: string;
} {
  if (isPaid) {
    return {
      status: 'PAID',
      label: 'Pagado',
      color: 'text-green-600 bg-green-50',
    };
  }

  const daysUntilDue = getDaysUntilDue(dueDate);

  if (daysUntilDue < 0) {
    return {
      status: 'OVERDUE',
      label: 'Vencido',
      color: 'text-red-600 bg-red-50',
    };
  } else if (daysUntilDue <= 7) {
    return {
      status: 'DUE_SOON',
      label: 'Vence pronto',
      color: 'text-orange-600 bg-orange-50',
    };
  } else {
    return {
      status: 'UPCOMING',
      label: 'Próximo',
      color: 'text-blue-600 bg-blue-50',
    };
  }
}

/**
 * Calculate expense summary
 */
export function calculateExpenseSummary(
  expenses: Array<{
    amount: number;
    type: string;
    isPaid: boolean;
    frequency: string;
  }>
): {
  totalFixed: number;
  totalVariable: number;
  totalPaid: number;
  totalPending: number;
  monthlyFixed: number;
  monthlyVariable: number;
} {
  let totalFixed = 0;
  let totalVariable = 0;
  let totalPaid = 0;
  let totalPending = 0;
  let monthlyFixed = 0;
  let monthlyVariable = 0;

  expenses.forEach(expense => {
    const monthlyAmount = calculateMonthlyExpenseAmount(
      expense.amount,
      expense.frequency
    );

    if (expense.type === 'FIXED') {
      totalFixed += expense.amount;
      monthlyFixed += monthlyAmount;
    } else {
      totalVariable += expense.amount;
      monthlyVariable += monthlyAmount;
    }

    if (expense.isPaid) {
      totalPaid += expense.amount;
    } else {
      totalPending += expense.amount;
    }
  });

  return {
    totalFixed,
    totalVariable,
    totalPaid,
    totalPending,
    monthlyFixed,
    monthlyVariable,
  };
}
