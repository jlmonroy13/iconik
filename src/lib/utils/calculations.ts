import { ServiceType } from '@/generated/prisma';

// =====================================================
// CALCULATION UTILITIES
// =====================================================

/**
 * Determine if a service type should have kit cost
 * Only nail-related services have kit costs
 */
export function shouldHaveKitCost(serviceType: ServiceType): boolean {
  const servicesWithKitCost: ServiceType[] = [
    'MANICURE',
    'PEDICURE',
    'NAIL_ART',
    'GEL_POLISH',
    'ACRYLIC_NAILS',
    'NAIL_REPAIR',
  ];

  return servicesWithKitCost.includes(serviceType);
}

/**
 * Get default kit cost for service type
 */
export function getDefaultKitCost(serviceType: ServiceType): number {
  const defaultKitCosts: Record<ServiceType, number> = {
    MANICURE: 1000,
    PEDICURE: 1000,
    NAIL_ART: 2000,
    GEL_POLISH: 1500,
    ACRYLIC_NAILS: 2000,
    NAIL_REPAIR: 1000,
    HAND_SPA: 0,
    FOOT_SPA: 0,
    OTHER: 0,
  };

  return defaultKitCosts[serviceType] || 0;
}

/**
 * Validate kit cost for service type
 */
export function validateKitCost(
  serviceType: ServiceType,
  kitCost: number
): {
  isValid: boolean;
  message?: string;
} {
  if (kitCost < 0) {
    return {
      isValid: false,
      message: 'Kit cost cannot be negative',
    };
  }

  if (!shouldHaveKitCost(serviceType) && kitCost > 0) {
    return {
      isValid: false,
      message: 'This service type does not require a kit cost',
    };
  }

  if (shouldHaveKitCost(serviceType) && kitCost === 0) {
    return {
      isValid: true,
      message: 'Warning: This service type typically requires a kit cost',
    };
  }

  return { isValid: true };
}

/**
 * Calculate total service cost including kit cost and tax
 */
export function calculateTotalServiceCost(
  price: number,
  kitCost?: number,
  taxRate?: number
): number {
  const subtotal = price + (kitCost || 0);
  const taxAmount = taxRate ? subtotal * taxRate : 0;
  return subtotal + taxAmount;
}

/**
 * Format tax rate as percentage
 */
export function formatTaxRate(taxRate: number): string {
  return `${(taxRate * 100).toFixed(0)}%`;
}

/**
 * Format tax rate as decimal (e.g., 0.19 for 19%)
 */
export function parseTaxRate(taxRateString: string): number {
  const percentage = parseFloat(taxRateString.replace('%', ''));
  return percentage / 100;
}

/**
 * Calculate tax amount
 */
export function calculateTaxAmount(subtotal: number, taxRate?: number): number {
  if (!taxRate) return 0;
  return subtotal * taxRate;
}

/**
 * Calculate subtotal (price + kit cost without tax)
 */
export function calculateSubtotal(price: number, kitCost?: number): number {
  return price + (kitCost || 0);
}

/**
 * Calculate commission with kit cost and tax consideration
 * Commission is calculated ONLY on service price (not kit cost, not tax)
 * Kit cost goes directly to spa
 * Tax goes to government
 */
export function calculateCommissionWithKitCostAndTax(
  servicePrice: number,
  kitCost: number = 0,
  taxRate: number = 0,
  commissionRate: number,
  discountAmount: number = 0,
  discountAffectsCommission: boolean = false
): {
  // Service breakdown
  servicePrice: number;
  kitCost: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;

  // Commission calculation (ONLY on service price)
  commissionRate: number;
  originalCommissionAmount: number;
  finalCommissionAmount: number;

  // Money distribution
  manicuristEarnings: number;
  spaEarnings: number;
  governmentTax: number;

  // Discount handling
  discountAmount: number;
  discountAffectsCommission: boolean;
  finalTotal: number;
} {
  const finalKitCost = kitCost || 0;
  const finalTaxRate = taxRate || 0;

  // Service breakdown
  const subtotal = servicePrice + finalKitCost;
  const taxAmount = calculateTaxAmount(subtotal, finalTaxRate);
  const totalAmount = subtotal + taxAmount;

  // Commission calculation (ONLY on service price, not kit cost, not tax)
  const originalCommissionAmount = servicePrice * commissionRate;

  let finalCommissionAmount: number;
  let finalTotal: number;

  if (discountAffectsCommission) {
    // Discount affects both service price and commission proportionally
    const discountRatio = discountAmount / totalAmount;
    const discountedServicePrice = servicePrice * (1 - discountRatio);
    finalCommissionAmount = discountedServicePrice * commissionRate;
    finalTotal = totalAmount - discountAmount;
  } else {
    // Discount only affects spa portion, commission stays the same
    finalCommissionAmount = originalCommissionAmount;
    finalTotal = totalAmount - discountAmount;
  }

  // Money distribution
  const manicuristEarnings = finalCommissionAmount;
  const governmentTax = taxAmount;
  const spaEarnings = finalTotal - manicuristEarnings - governmentTax;

  return {
    // Service breakdown
    servicePrice,
    kitCost: finalKitCost,
    subtotal,
    taxAmount,
    totalAmount,

    // Commission calculation
    commissionRate,
    originalCommissionAmount,
    finalCommissionAmount,

    // Money distribution
    manicuristEarnings,
    spaEarnings,
    governmentTax,

    // Discount handling
    discountAmount,
    discountAffectsCommission,
    finalTotal,
  };
}

/**
 * Calculate commission breakdown for display
 */
export function calculateCommissionBreakdown(
  servicePrice: number,
  kitCost: number = 0,
  taxRate: number = 0,
  commissionRate: number,
  discountAmount: number = 0,
  discountAffectsCommission: boolean = false
): {
  breakdown: {
    label: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
  summary: {
    total: number;
    manicurist: number;
    spa: number;
    tax: number;
    discount: number;
  };
} {
  const result = calculateCommissionWithKitCostAndTax(
    servicePrice,
    kitCost,
    taxRate,
    commissionRate,
    discountAmount,
    discountAffectsCommission
  );

  const breakdown = [
    {
      label: 'Precio del servicio',
      amount: result.servicePrice,
      percentage: (result.servicePrice / result.totalAmount) * 100,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'Costo del kit',
      amount: result.kitCost,
      percentage: (result.kitCost / result.totalAmount) * 100,
      color: 'bg-green-100 text-green-800',
    },
    {
      label: 'Impuestos',
      amount: result.taxAmount,
      percentage: (result.taxAmount / result.totalAmount) * 100,
      color: 'bg-red-100 text-red-800',
    },
  ];

  if (result.discountAmount > 0) {
    breakdown.push({
      label: 'Descuento',
      amount: -result.discountAmount,
      percentage: -(result.discountAmount / result.totalAmount) * 100,
      color: 'bg-orange-100 text-orange-800',
    });
  }

  return {
    breakdown,
    summary: {
      total: result.finalTotal,
      manicurist: result.manicuristEarnings,
      spa: result.spaEarnings,
      tax: result.governmentTax,
      discount: result.discountAmount,
    },
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(
  amount: number,
  currency: string = 'COP'
): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(
  originalAmount: number,
  finalAmount: number
): number {
  if (originalAmount === 0) return 0;
  return ((originalAmount - finalAmount) / originalAmount) * 100;
}

/**
 * Calculate total for multiple services with kit costs and taxes
 */
export function calculateTotalForServices(
  services: Array<{ price: number; kitCost?: number; taxRate?: number }>
): {
  totalServicePrice: number;
  totalKitCost: number;
  totalSubtotal: number;
  totalTaxAmount: number;
  totalAmount: number;
} {
  const totalServicePrice = services.reduce(
    (sum, service) => sum + service.price,
    0
  );
  const totalKitCost = services.reduce(
    (sum, service) => sum + (service.kitCost || 0),
    0
  );
  const totalSubtotal = totalServicePrice + totalKitCost;

  // Calculate tax for each service individually (in case different services have different tax rates)
  const totalTaxAmount = services.reduce((sum, service) => {
    const serviceSubtotal = service.price + (service.kitCost || 0);
    return sum + calculateTaxAmount(serviceSubtotal, service.taxRate);
  }, 0);

  const totalAmount = totalSubtotal + totalTaxAmount;

  return {
    totalServicePrice,
    totalKitCost,
    totalSubtotal,
    totalTaxAmount,
    totalAmount,
  };
}

/**
 * Calculate commission with kit cost consideration (backward compatibility)
 * Kit cost goes directly to spa and doesn't affect manicurist commission
 */
export function calculateCommissionWithKitCost(
  servicePrice: number,
  kitCost: number = 0,
  commissionRate: number,
  discountAmount: number = 0,
  discountAffectsCommission: boolean = false
): {
  originalServiceAmount: number;
  finalServiceAmount: number;
  kitCost: number;
  originalCommissionAmount: number;
  finalCommissionAmount: number;
  finalSpaAmount: number;
  discountAffectsCommission: boolean;
} {
  const result = calculateCommissionWithKitCostAndTax(
    servicePrice,
    kitCost,
    0, // No tax for backward compatibility
    commissionRate,
    discountAmount,
    discountAffectsCommission
  );

  return {
    originalServiceAmount: result.totalAmount,
    finalServiceAmount: result.finalTotal,
    kitCost: result.kitCost,
    originalCommissionAmount: result.originalCommissionAmount,
    finalCommissionAmount: result.finalCommissionAmount,
    finalSpaAmount: result.spaEarnings,
    discountAffectsCommission: result.discountAffectsCommission,
  };
}

/**
 * Calculate transaction fee amount
 */
export function calculateTransactionFee(
  amount: number,
  feeRate: number
): number {
  return amount * feeRate;
}

/**
 * Calculate net amount after transaction fee
 */
export function calculateNetAmount(amount: number, feeRate: number): number {
  return amount - calculateTransactionFee(amount, feeRate);
}

/**
 * Calculate commission with kit cost, tax, and transaction fees
 * Commission is calculated ONLY on service price (not kit cost, not tax, not fees)
 * Kit cost goes directly to spa
 * Tax goes to government
 * Transaction fees are deducted from spa earnings
 */
export function calculateCommissionWithKitCostTaxAndFees(
  servicePrice: number,
  kitCost: number = 0,
  taxRate: number = 0,
  commissionRate: number,
  discountAmount: number = 0,
  discountAffectsCommission: boolean = false,
  transactionFeeRate: number = 0
): {
  // Service breakdown
  servicePrice: number;
  kitCost: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;

  // Commission calculation (ONLY on service price)
  commissionRate: number;
  originalCommissionAmount: number;
  finalCommissionAmount: number;

  // Money distribution
  manicuristEarnings: number;
  spaEarnings: number;
  governmentTax: number;
  transactionFeeAmount: number;
  spaNetEarnings: number; // After transaction fees

  // Discount handling
  discountAmount: number;
  discountAffectsCommission: boolean;
  finalTotal: number;
} {
  const finalKitCost = kitCost || 0;
  const finalTaxRate = taxRate || 0;
  const finalTransactionFeeRate = transactionFeeRate || 0;

  // Service breakdown
  const subtotal = servicePrice + finalKitCost;
  const taxAmount = calculateTaxAmount(subtotal, finalTaxRate);
  const totalAmount = subtotal + taxAmount;

  // Commission calculation (ONLY on service price, not kit cost, not tax, not fees)
  const originalCommissionAmount = servicePrice * commissionRate;

  let finalCommissionAmount: number;
  let finalTotal: number;

  if (discountAffectsCommission) {
    // Discount affects both service price and commission proportionally
    const discountRatio = discountAmount / totalAmount;
    const discountedServicePrice = servicePrice * (1 - discountRatio);
    finalCommissionAmount = discountedServicePrice * commissionRate;
    finalTotal = totalAmount - discountAmount;
  } else {
    // Discount only affects spa portion, commission stays the same
    finalCommissionAmount = originalCommissionAmount;
    finalTotal = totalAmount - discountAmount;
  }

  // Transaction fee calculation
  const transactionFeeAmount = calculateTransactionFee(
    finalTotal,
    finalTransactionFeeRate
  );

  // Money distribution
  const manicuristEarnings = finalCommissionAmount;
  const governmentTax = taxAmount;
  const spaEarnings = finalTotal - manicuristEarnings - governmentTax;
  const spaNetEarnings = spaEarnings - transactionFeeAmount;

  return {
    // Service breakdown
    servicePrice,
    kitCost: finalKitCost,
    subtotal,
    taxAmount,
    totalAmount,

    // Commission calculation
    commissionRate,
    originalCommissionAmount,
    finalCommissionAmount,

    // Money distribution
    manicuristEarnings,
    spaEarnings,
    governmentTax,
    transactionFeeAmount,
    spaNetEarnings,

    // Discount handling
    discountAmount,
    discountAffectsCommission,
    finalTotal,
  };
}

/**
 * Get default transaction fees for common payment methods
 */
export function getDefaultTransactionFees(): Record<string, number> {
  return {
    Cash: 0,
    Efectivo: 0,
    Visa: 0.035, // 3.5%
    Mastercard: 0.035, // 3.5%
    'American Express': 0.045, // 4.5%
    Amex: 0.045, // 4.5%
    Débito: 0.025, // 2.5%
    Debit: 0.025, // 2.5%
    Transferencia: 0.01, // 1%
    Transfer: 0.01, // 1%
    Nequi: 0.015, // 1.5%
    Daviplata: 0.015, // 1.5%
    Bancolombia: 0.02, // 2%
  };
}

/**
 * Format transaction fee as percentage
 */
export function formatTransactionFee(feeRate: number): string {
  if (feeRate === 0) return 'Sin comisión';
  return `${(feeRate * 100).toFixed(2)}%`;
}
