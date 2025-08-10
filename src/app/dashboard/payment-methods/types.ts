import type { PaymentMethod, PaymentMethodFormData } from '@/types';

// Re-export the main types from shared types
export type { PaymentMethod, PaymentMethodFormData };

// Payment method filters
export interface PaymentMethodFilters {
  isActive?: boolean;
  type?: string;
  search?: string;
}

// Payment method stats
export interface PaymentMethodStats {
  total: number;
  active: number;
  inactive: number;
  totalPayments: number;
  totalAmount: number;
  byMethod: Array<{
    method: PaymentMethod;
    count: number;
    amount: number;
    percentage: number;
  }>;
}

// Payment method option for selects
export interface PaymentMethodOption {
  id: string;
  name: string;
  type?: string;
  icon?: string;
  isActive: boolean;
}
