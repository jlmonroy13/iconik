/**
 * Utility functions for commission calculations
 */

/**
 * Calculate commission amounts for a service
 * @param serviceAmount - Total amount of the service
 * @param commissionRate - Commission rate (0.0 to 1.0)
 * @returns Object with commission and spa amounts
 */
export function calculateCommission(
  serviceAmount: number,
  commissionRate: number
) {
  const commissionAmount = serviceAmount * commissionRate;
  const spaAmount = serviceAmount - commissionAmount;

  return {
    commissionAmount: Math.round(commissionAmount * 100) / 100, // Round to 2 decimal places
    spaAmount: Math.round(spaAmount * 100) / 100,
  };
}

/**
 * Format commission rate as percentage
 * @param rate - Commission rate (0.0 to 1.0)
 * @returns Formatted percentage string
 */
export function formatCommissionRate(rate: number): string {
  return `${(rate * 100).toFixed(0)}%`;
}

/**
 * Parse commission rate from percentage string
 * @param percentage - Percentage string (e.g., "50%")
 * @returns Commission rate (0.0 to 1.0)
 */
export function parseCommissionRate(percentage: string): number {
  const num = parseFloat(percentage.replace('%', ''));
  return num / 100;
}

/**
 * Calculate total commissions for a manicurist
 * @param commissions - Array of commission objects
 * @param isPaid - Filter by paid status (optional)
 * @returns Total commission amount
 */
export function calculateTotalCommissions(
  commissions: Array<{ commissionAmount: number; isPaid: boolean }>,
  isPaid?: boolean
): number {
  const filteredCommissions =
    isPaid !== undefined
      ? commissions.filter(c => c.isPaid === isPaid)
      : commissions;

  return filteredCommissions.reduce((total, commission) => {
    return total + commission.commissionAmount;
  }, 0);
}

/**
 * Calculate average commission rate
 * @param commissions - Array of commission objects
 * @returns Average commission rate (0.0 to 1.0)
 */
export function calculateAverageCommissionRate(
  commissions: Array<{ commissionRate: number }>
): number {
  if (commissions.length === 0) return 0;

  const totalRate = commissions.reduce((sum, commission) => {
    return sum + commission.commissionRate;
  }, 0);

  return totalRate / commissions.length;
}

/**
 * Get commission status badge variant
 * @param isPaid - Whether the commission is paid
 * @returns Badge variant
 */
export function getCommissionStatusVariant(
  isPaid: boolean
): 'success' | 'warning' | 'secondary' {
  if (isPaid) return 'success';
  return 'warning';
}

/**
 * Get commission status text
 * @param isPaid - Whether the commission is paid
 * @returns Status text
 */
export function getCommissionStatusText(isPaid: boolean): string {
  return isPaid ? 'Pagada' : 'Pendiente';
}
