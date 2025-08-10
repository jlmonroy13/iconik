// =====================================================
// SHARED TYPES - Based on new Prisma schema
// =====================================================

import {
  ServiceType,
  AppointmentStatus,
  ServiceTimeRating,
} from '@/generated/prisma';

// =====================================================
// BASE MODELS
// =====================================================

export interface Spa {
  id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'MANICURIST' | 'CLIENT';
  spaId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  documentType: string;
  documentNumber: string;
  phone?: string;
  email?: string;
  birthday?: Date;
  notes?: string;
  spaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Manicurist {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  commission: number;
  isActive: boolean;
  spaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  type: ServiceType;
  name: string;
  description?: string | null;
  price: number; // Base service price
  kitCost?: number | null; // Optional kit cost (goes directly to spa)
  taxRate?: number | null; // Optional tax rate (e.g., 0.19 for 19% VAT)
  duration: number; // minutes
  recommendedReturnDays?: number | null;
  imageUrl?: string | null;
  isActive: boolean;
  spaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  clientId: string;
  manicuristId?: string;
  isScheduled: boolean; // true = scheduled, false = walk-in
  scheduledAt: Date;
  status: AppointmentStatus;
  notes?: string;
  spaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentService {
  id: string;
  appointmentId: string;
  serviceId: string;
  manicuristId: string;

  // Times by manicurist
  startedAtByManicurist?: Date;
  endedAtByManicurist?: Date;

  // Times by admin
  startedAtByAdmin?: Date;
  endedAtByAdmin?: Date;

  durationAvg?: number; // minutes
  price: number; // Base service price
  kitCost?: number; // Optional kit cost (goes directly to spa)
  taxRate?: number; // Optional tax rate (e.g., 0.19 for 19% VAT)
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type?: string; // 'Cash', 'Digital', 'Card', etc.
  isActive: boolean;
  icon?: string;
  transactionFee: number; // Transaction fee percentage (e.g., 0.035 for 3.5%)
  spaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  appointmentId?: string;
  appointmentServiceId?: string;
  paymentMethodId: string;
  amount: number;
  paidAt: Date;
  reference?: string;

  // Discount fields
  originalAmount: number; // Original amount before discount
  discountAmount: number; // Amount of discount
  discountReason?: string; // Reason for discount
  discountAffectsCommission: boolean; // If true, discount affects manicurist commission

  // Transaction fee fields
  transactionFeeAmount: number; // Amount of transaction fee
  transactionFeeRate: number; // Transaction fee rate used

  spaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commission {
  id: string;
  paymentId: string;
  manicuristId: string;
  appointmentServiceId: string;

  // Commission calculation
  serviceAmount: number;
  commissionRate: number;
  commissionAmount: number;
  spaAmount: number;

  // Status
  isPaid: boolean;
  paidAt?: Date;
  paymentReference?: string;

  spaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  id: string;
  appointmentServiceId: string;
  token: string;
  tokenExpiresAt: Date;

  // Ratings
  serviceTimeRating: ServiceTimeRating;
  workQualityRating: number; // 1-5 stars
  manicuristAttentionRating: number; // 1-5 stars
  spaAdminAttentionRating: number; // 1-5 stars

  comment?: string;
  isSubmitted: boolean;
  submittedAt?: Date;
  spaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  name: string;
  description?: string;
  amount: number;
  type: 'FIXED' | 'VARIABLE';
  category:
    | 'RENT'
    | 'SALARIES'
    | 'MARKETING'
    | 'SUPPLIES'
    | 'UTILITIES'
    | 'INSURANCE'
    | 'MAINTENANCE'
    | 'EQUIPMENT'
    | 'SOFTWARE'
    | 'PROFESSIONAL'
    | 'TRAINING'
    | 'TRAVEL'
    | 'FOOD'
    | 'CLEANING'
    | 'SECURITY'
    | 'OTHER';
  frequency: 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'ONE_TIME';
  dueDate?: Date;
  paidAt?: Date;
  isPaid: boolean;
  isActive: boolean;
  spaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpensePayment {
  id: string;
  expenseId: string;
  amount: number;
  paidAt: Date;
  paymentMethodId: string;
  reference?: string;
  notes?: string;
  spaId: string;
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// RELATIONSHIP MODELS (with includes)
// =====================================================

export interface AppointmentWithDetails extends Appointment {
  client: Client;
  manicurist?: Manicurist;
  services: AppointmentServiceWithDetails[];
  payments: PaymentWithDetails[];
}

export interface AppointmentServiceWithDetails extends AppointmentService {
  appointment: Appointment;
  service: Service;
  manicurist: Manicurist;
  payments: PaymentWithDetails[];
  feedback?: Feedback;
}

export interface PaymentWithDetails extends Payment {
  appointment?: Appointment;
  appointmentService?: AppointmentService;
  paymentMethod: PaymentMethod;
  commission?: CommissionWithDetails;
}

export interface CommissionWithDetails extends Commission {
  payment: Payment;
  manicurist: Manicurist;
  appointmentService: AppointmentService;
}

export interface ClientWithDetails extends Client {
  appointments: AppointmentWithDetails[];
}

export interface ManicuristWithDetails extends Manicurist {
  appointments: Appointment[];
  appointmentServices: AppointmentServiceWithDetails[];
  commissions: CommissionWithDetails[];
}

export interface ServiceWithDetails extends Service {
  appointmentServices: AppointmentServiceWithDetails[];
}

export interface ExpenseWithDetails extends Expense {
  payments: ExpensePaymentWithDetails[];
}

export interface ExpensePaymentWithDetails extends ExpensePayment {
  expense: Expense;
  paymentMethod: PaymentMethod;
}

// =====================================================
// FORM TYPES
// =====================================================

export interface ServiceFormData {
  type: ServiceType;
  name: string;
  description?: string;
  price: number; // Base service price
  kitCost?: number; // Optional kit cost (goes directly to spa)
  taxRate?: number; // Optional tax rate (e.g., 0.19 for 19% VAT)
  duration: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface AppointmentFormData {
  clientId: string;
  manicuristId?: string;
  isScheduled: boolean;
  scheduledAt: Date;
  status: AppointmentStatus;
  notes?: string;
  services: AppointmentServiceFormData[];
}

export interface AppointmentServiceFormData {
  serviceId: string;
  manicuristId: string;
  price: number; // Base service price
  kitCost?: number; // Optional kit cost (goes directly to spa)
  taxRate?: number; // Optional tax rate (e.g., 0.19 for 19% VAT)
}

export interface PaymentFormData {
  appointmentId?: string;
  appointmentServiceId?: string;
  paymentMethodId: string;
  amount: number;
  reference?: string;
}

export interface PaymentMethodFormData {
  name: string;
  type?: string;
  isActive: boolean;
  icon?: string;
  transactionFee: number; // Transaction fee percentage
}

export interface FeedbackFormData {
  serviceTimeRating: ServiceTimeRating;
  workQualityRating: number;
  manicuristAttentionRating: number;
  spaAdminAttentionRating: number;
  comment?: string;
}

export interface CommissionFormData {
  paymentId: string;
  manicuristId: string;
  appointmentServiceId: string;
  serviceAmount: number;
  commissionRate: number;
  isPaid: boolean;
  paymentReference?: string;
}

export interface ExpenseFormData {
  name: string;
  description?: string;
  amount: number;
  type: 'FIXED' | 'VARIABLE';
  category:
    | 'RENT'
    | 'SALARIES'
    | 'MARKETING'
    | 'SUPPLIES'
    | 'UTILITIES'
    | 'INSURANCE'
    | 'MAINTENANCE'
    | 'EQUIPMENT'
    | 'SOFTWARE'
    | 'PROFESSIONAL'
    | 'TRAINING'
    | 'TRAVEL'
    | 'FOOD'
    | 'CLEANING'
    | 'SECURITY'
    | 'OTHER';
  frequency: 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'ONE_TIME';
  dueDate?: Date;
  isActive: boolean;
}

export interface ExpensePaymentFormData {
  expenseId: string;
  amount: number;
  paymentMethodId: string;
  reference?: string;
  notes?: string;
}

// =====================================================
// FILTER TYPES
// =====================================================

export interface ServiceFilters {
  type?: ServiceType;
  isActive?: boolean;
  search?: string;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  clientId?: string;
  manicuristId?: string;
  isScheduled?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PaymentFilters {
  paymentMethodId?: string;
  appointmentId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ClientFilters {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  dateFrom?: string;
  dateTo?: string;
}

export interface ManicuristFilters {
  search?: string;
  isActive?: boolean;
}

export interface ExpenseFilters {
  type?: 'FIXED' | 'VARIABLE';
  category?:
    | 'RENT'
    | 'SALARIES'
    | 'MARKETING'
    | 'SUPPLIES'
    | 'UTILITIES'
    | 'INSURANCE'
    | 'MAINTENANCE'
    | 'EQUIPMENT'
    | 'SOFTWARE'
    | 'PROFESSIONAL'
    | 'TRAINING'
    | 'TRAVEL'
    | 'FOOD'
    | 'CLEANING'
    | 'SECURITY'
    | 'OTHER';
  frequency?: 'MONTHLY' | 'WEEKLY' | 'DAILY' | 'ONE_TIME';
  isPaid?: boolean;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// =====================================================
// STATS TYPES
// =====================================================

export interface DashboardStats {
  totalServices: number;
  totalRevenue: number;
  totalClients: number;
  totalAppointments: number;
  recentServices: AppointmentServiceWithDetails[];
  upcomingAppointments: AppointmentWithDetails[];
  averageRating: number;
  pendingFeedback: number;
}

export interface ServiceStats {
  total: number;
  active: number;
  inactive: number;
  mostRequestedServiceName: string;
  totalRevenue: number;
}

export interface AppointmentStats {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export interface PaymentStats {
  total: number;
  totalAmount: number;
  byMethod: Array<{
    method: PaymentMethod;
    count: number;
    amount: number;
  }>;
}

export interface FeedbackStats {
  total: number;
  averageWorkQuality: number;
  averageManicuristAttention: number;
  averageSpaAdminAttention: number;
  averageServiceTime: ServiceTimeRating;
  byManicurist: Array<{
    manicurist: Manicurist;
    count: number;
    averageRating: number;
  }>;
}

export interface CommissionStats {
  total: number;
  totalCommissions: number;
  totalSpaRevenue: number;
  pendingCommissions: number;
  paidCommissions: number;
  byManicurist: Array<{
    manicurist: Manicurist;
    totalCommissions: number;
    pendingCommissions: number;
    paidCommissions: number;
    averageCommissionRate: number;
  }>;
}

export interface ExpenseStats {
  total: number;
  totalAmount: number;
  fixedExpenses: number;
  variableExpenses: number;
  paidExpenses: number;
  pendingExpenses: number;
  byCategory: Array<{
    category: string;
    count: number;
    amount: number;
  }>;
  byFrequency: Array<{
    frequency: string;
    count: number;
    amount: number;
  }>;
}

// =====================================================
// UTILITY TYPES
// =====================================================

export interface Option {
  id: string;
  name: string;
  value?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}
