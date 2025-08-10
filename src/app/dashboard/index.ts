// Dashboard Module Exports

// Types
export type {
  DashboardStats,
  Appointment,
  Payment,
  CashRegister,
  TopManicurist,
  PopularService,
} from './types/dashboard';

// Services
export { getDashboardStats } from '@/services/dashboard';

// Hooks
export {
  useDashboard,
  useDashboardFilters,
  useDashboardLayout,
} from './hooks/useDashboard';

// Components
export {
  TodayOverview,
  FinancialOverview,
  AlertsSection,
  UpcomingAppointments,
  RecentPayments,
  TopPerformers,
  PopularServices,
  CashRegisterStatus,
} from './components';

// Utils
export {
  formatCurrency,
  formatDate,
  formatShortDate,
  formatPercentage,
  formatDuration,
} from './utils/formatters';

export {
  calculatePercentageChange,
  calculateGrowthRate,
  calculateAverage,
  calculateTotal,
  formatLargeNumber,
  getStatusColor,
  calculateCompletionRate,
  getTrendDirection,
  calculateEfficiencyScore,
  getAlertPriority,
  calculateCashFlow,
  getPerformanceRating,
  calculateRevenuePerService,
  calculateRetentionRate,
  getDashboardInsights,
  validateDashboardData,
  getDashboardSummary,
} from './utils/dashboardUtils';

// Config
export {
  DASHBOARD_CONFIG,
  DASHBOARD_SECTIONS,
  METRIC_COLORS,
} from './config/dashboardConfig';

// Default export for the main page component
export { default as DashboardPage } from './page';
