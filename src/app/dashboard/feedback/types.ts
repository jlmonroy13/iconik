import { ServiceTimeRating } from '@/generated/prisma';
import type { Feedback, FeedbackFormData, FeedbackStats } from '@/types';

// Re-export the main types from shared types
export type { Feedback, FeedbackFormData, FeedbackStats };

// Feedback with appointment service details
export interface FeedbackWithDetails extends Feedback {
  appointmentService: {
    id: string;
    service: {
      id: string;
      name: string;
      type: string;
    };
    manicurist: {
      id: string;
      name: string;
    };
    appointment: {
      id: string;
      client: {
        id: string;
        name: string;
      };
      scheduledAt: Date;
    };
  };
}

// Feedback filters
export interface FeedbackFilters {
  serviceTimeRating?: ServiceTimeRating;
  workQualityRating?: number;
  manicuristAttentionRating?: number;
  spaAdminAttentionRating?: number;
  manicuristId?: string;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
  isSubmitted?: boolean;
  search?: string;
}

// Feedback summary for lists
export interface FeedbackSummary {
  id: string;
  token: string;
  isSubmitted: boolean;
  submittedAt?: Date;
  serviceTimeRating: ServiceTimeRating;
  workQualityRating: number;
  manicuristAttentionRating: number;
  spaAdminAttentionRating: number;
  comment?: string;
  service: {
    id: string;
    name: string;
    type: string;
  };
  manicurist: {
    id: string;
    name: string;
  };
  client: {
    id: string;
    name: string;
  };
  appointment: {
    id: string;
    scheduledAt: Date;
  };
}

// Feedback stats by period
export interface FeedbackPeriodStats {
  period: string;
  total: number;
  averageWorkQuality: number;
  averageManicuristAttention: number;
  averageSpaAdminAttention: number;
  averageServiceTime: ServiceTimeRating;
  submittedCount: number;
  submissionRate: number;
}

// Feedback token validation
export interface FeedbackTokenValidation {
  isValid: boolean;
  isExpired: boolean;
  isSubmitted: boolean;
  feedback?: FeedbackWithDetails;
  error?: string;
}
