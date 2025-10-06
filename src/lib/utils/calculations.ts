// =====================================================
// CALCULATION UTILITIES
// =====================================================

/**
 * Calculate total service cost including tax
 */
export function calculateTotalServiceCost(
  price: number,
  taxRate?: number
): number {
  const subtotal = price;
  const taxAmount = taxRate ? subtotal * (taxRate / 100) : 0;
  return subtotal + taxAmount;
}

/**
 * Format tax rate as percentage
 */
export function formatTaxRate(taxRate: number): string {
  return `${taxRate.toFixed(0)}%`;
}

/**
 * Parse tax rate from string (e.g., "19%" returns 19)
 */
export function parseTaxRate(taxRateString: string): number {
  return parseFloat(taxRateString.replace('%', ''));
}

/**
 * Calculate tax amount
 * taxRate is now a percentage (e.g., 19 for 19%)
 */
export function calculateTaxAmount(subtotal: number, taxRate?: number): number {
  if (!taxRate) return 0;
  return subtotal * (taxRate / 100);
}

/**
 * Calculate subtotal (price without tax)
 */
export function calculateSubtotal(price: number): number {
  return price;
}

/**
 * Calculate commission with tax consideration
 * Commission is calculated ONLY on service price (not tax)
 * Tax goes to government
 */
export function calculateCommissionWithTax(
  servicePrice: number,
  taxRate: number = 0,
  commissionRate: number,
  discountAmount: number = 0,
  discountAffectsCommission: boolean = false
): {
  // Service breakdown
  servicePrice: number;
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
  const finalTaxRate = taxRate || 0;

  // Service breakdown
  const subtotal = servicePrice;
  const taxAmount = calculateTaxAmount(subtotal, finalTaxRate);
  const totalAmount = subtotal + taxAmount;

  // Commission calculation (ONLY on service price, not tax)
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
  const result = calculateCommissionWithTax(
    servicePrice,
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
 * Calculate total for multiple services with taxes
 */
export function calculateTotalForServices(
  services: Array<{ price: number; taxRate?: number }>
): {
  totalServicePrice: number;
  totalSubtotal: number;
  totalTaxAmount: number;
  totalAmount: number;
} {
  const totalServicePrice = services.reduce(
    (sum, service) => sum + service.price,
    0
  );
  const totalSubtotal = totalServicePrice;

  // Calculate tax for each service individually (in case different services have different tax rates)
  const totalTaxAmount = services.reduce((sum, service) => {
    return sum + calculateTaxAmount(service.price, service.taxRate);
  }, 0);

  const totalAmount = totalSubtotal + totalTaxAmount;

  return {
    totalServicePrice,
    totalSubtotal,
    totalTaxAmount,
    totalAmount,
  };
}

/**
 * Calculate commission (backward compatibility)
 */
export function calculateCommission(
  servicePrice: number,
  commissionRate: number,
  discountAmount: number = 0,
  discountAffectsCommission: boolean = false
): {
  originalServiceAmount: number;
  finalServiceAmount: number;
  originalCommissionAmount: number;
  finalCommissionAmount: number;
  finalSpaAmount: number;
  discountAffectsCommission: boolean;
} {
  const result = calculateCommissionWithTax(
    servicePrice,
    0, // No tax for backward compatibility
    commissionRate,
    discountAmount,
    discountAffectsCommission
  );

  return {
    originalServiceAmount: result.totalAmount,
    finalServiceAmount: result.finalTotal,
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
 * Calculate commission with tax and transaction fees
 * Commission is calculated ONLY on service price (not tax, not fees)
 * Tax goes to government
 * Transaction fees are deducted from spa earnings
 */
export function calculateCommissionWithTaxAndFees(
  servicePrice: number,
  taxRate: number = 0,
  commissionRate: number,
  discountAmount: number = 0,
  discountAffectsCommission: boolean = false,
  transactionFeeRate: number = 0
): {
  // Service breakdown
  servicePrice: number;
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
  const finalTaxRate = taxRate || 0;
  const finalTransactionFeeRate = transactionFeeRate || 0;

  // Service breakdown
  const subtotal = servicePrice;
  const taxAmount = calculateTaxAmount(subtotal, finalTaxRate);
  const totalAmount = subtotal + taxAmount;

  // Commission calculation (ONLY on service price, not tax, not fees)
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
