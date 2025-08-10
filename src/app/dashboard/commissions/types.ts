import type {
  Commission,
  CommissionWithDetails,
  CommissionFormData,
  CommissionStats,
} from '@/types';

// Re-export the main types from shared types
export type {
  Commission,
  CommissionWithDetails,
  CommissionFormData,
  CommissionStats,
};

// Commission filters
export interface CommissionFilters {
  manicuristId?: string;
  isPaid?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Commission summary for lists
export interface CommissionSummary {
  id: string;
  serviceAmount: number;
  commissionAmount: number;
  spaAmount: number;
  commissionRate: number;
  isPaid: boolean;
  paidAt?: Date;
  paymentReference?: string;
  manicurist: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
    type: string;
  };
  client: {
    id: string;
    name: string;
  };
  appointment: {
    id: string;
    scheduledAt: Date;
  };
  payment: {
    id: string;
    paidAt: Date;
    paymentMethod: {
      id: string;
      name: string;
    };
  };
}

// Commission payment form
export interface CommissionPaymentFormData {
  commissionId: string;
  paymentReference: string;
  paidAt: Date;
}
