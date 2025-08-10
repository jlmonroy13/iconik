// Types for dashboard data structures

export interface Appointment {
  id: string;
  client: { name: string };
  manicurist?: { name: string };
  scheduledAt: Date;
  status: string;
  services: Array<{ service: { name: string } }>;
}

export interface Payment {
  id: string;
  amount: number;
  paidAt: Date;
  paymentMethod: { name: string };
  appointment?: { client: { name: string } };
}

export interface CashRegister {
  cashRegister: { name: string };
  opener: { name: string };
}

export interface TopManicurist {
  manicuristId: string;
  manicurist?: { name: string };
  _count: { id: number };
  _sum: { price: number };
}

export interface PopularService {
  serviceId: string;
  service?: { name: string };
  _count: { id: number };
  _sum: { price: number };
}

export interface SalesGoal {
  id: string;
  name: string;
  type: 'REVENUE' | 'SERVICES' | 'CLIENTS' | 'APPOINTMENTS';
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  targetAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate?: Date | null;
  isActive: boolean;
  manicurist?: { name: string } | null;
  service?: { name: string } | null;
}

export interface DashboardStats {
  // Today's stats
  todayAppointments: number;
  todayRevenue: number;
  todayServices: number;
  todayClients: number;

  // Week stats
  weekRevenue: number;
  weekServices: number;
  weekNewClients: number;

  // Month stats
  monthRevenue: number;
  monthServices: number;
  monthNewClients: number;

  // Overall stats
  totalClients: number;
  totalServices: number;
  totalRevenue: number;

  // Pending items
  pendingApprovals: number;
  pendingPreConfirmations: number;
  upcomingAppointments: Appointment[];

  // Recent activity
  recentPayments: Payment[];
  recentAppointments: Appointment[];

  // Cash register
  openCashRegister: CashRegister | null;
  todayCashTransactions: {
    cashIn: number;
    cashOut: number;
  };

  // Top performers
  topManicurists: TopManicurist[];

  // Popular services
  popularServices: PopularService[];

  // Financial
  monthlyExpenses: number;
  commissionPayments: number;

  // Alerts
  overdueFollowUps: number;
  lowStockAlerts: number;

  // Sales Goals
  activeSalesGoals: SalesGoal[];
}
