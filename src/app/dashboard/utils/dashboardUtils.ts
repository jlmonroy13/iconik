import type { DashboardStats } from '../types/dashboard'

// Calculate percentage change between two values
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Calculate growth rate
export function calculateGrowthRate(current: number, previous: number): {
  value: number
  isPositive: boolean
  percentage: number
} {
  const change = current - previous
  const percentage = calculatePercentageChange(current, previous)

  return {
    value: change,
    isPositive: change >= 0,
    percentage: Math.abs(percentage)
  }
}

// Calculate average value
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

// Calculate total from array of objects with amount property
export function calculateTotal<T extends { amount: number }>(items: T[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0)
}

// Format large numbers with K, M suffixes
export function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Get status color based on value
export function getStatusColor(value: number, threshold: number = 0): 'positive' | 'negative' | 'neutral' {
  if (value > threshold) return 'positive'
  if (value < threshold) return 'negative'
  return 'neutral'
}

// Calculate completion rate
export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0
  return (completed / total) * 100
}

// Get trend direction
export function getTrendDirection(current: number, previous: number): 'up' | 'down' | 'stable' {
  const change = current - previous
  const threshold = Math.abs(previous) * 0.05 // 5% threshold

  if (Math.abs(change) < threshold) return 'stable'
  return change > 0 ? 'up' : 'down'
}

// Calculate efficiency score (0-100)
export function calculateEfficiencyScore(
  completed: number,
  total: number,
  onTime: number,
  qualityScore: number = 1
): number {
  const completionRate = calculateCompletionRate(completed, total)
  const onTimeRate = total > 0 ? (onTime / total) * 100 : 0

  return Math.round((completionRate * 0.4 + onTimeRate * 0.4 + qualityScore * 20) / 2)
}

// Get priority level for alerts
export function getAlertPriority(
  overdueFollowUps: number,
  pendingApprovals: number,
  pendingPreConfirmations: number
): 'high' | 'medium' | 'low' {
  const total = overdueFollowUps + pendingApprovals + pendingPreConfirmations

  if (total > 10) return 'high'
  if (total > 5) return 'medium'
  return 'low'
}

// Calculate cash flow
export function calculateCashFlow(cashIn: number, cashOut: number): {
  net: number
  isPositive: boolean
  percentage: number
} {
  const net = cashIn - cashOut
  const percentage = cashIn > 0 ? (cashOut / cashIn) * 100 : 0

  return {
    net,
    isPositive: net >= 0,
    percentage
  }
}

// Get performance rating
export function getPerformanceRating(score: number): {
  rating: 'excellent' | 'good' | 'average' | 'poor'
  color: string
  emoji: string
} {
  if (score >= 90) {
    return { rating: 'excellent', color: 'text-green-600', emoji: '🌟' }
  }
  if (score >= 75) {
    return { rating: 'good', color: 'text-blue-600', emoji: '👍' }
  }
  if (score >= 60) {
    return { rating: 'average', color: 'text-yellow-600', emoji: '😐' }
  }
  return { rating: 'poor', color: 'text-red-600', emoji: '⚠️' }
}

// Calculate revenue per service
export function calculateRevenuePerService(totalRevenue: number, totalServices: number): number {
  if (totalServices === 0) return 0
  return totalRevenue / totalServices
}

// Calculate client retention rate
export function calculateRetentionRate(
  returningClients: number,
  totalClients: number
): number {
  if (totalClients === 0) return 0
  return (returningClients / totalClients) * 100
}

// Get dashboard insights
export function getDashboardInsights(stats: DashboardStats): Array<{
  type: 'positive' | 'negative' | 'info'
  message: string
  value?: number
}> {
  const insights: Array<{
    type: 'positive' | 'negative' | 'info'
    message: string
    value?: number
  }> = []

  // Revenue insights
  if (stats.monthRevenue > stats.monthlyExpenses * 2) {
    insights.push({
      type: 'positive',
      message: 'Excelente margen de ganancia este mes',
      value: stats.monthRevenue
    })
  }

  // Client insights
  if (stats.monthNewClients > 10) {
    insights.push({
      type: 'positive',
      message: 'Gran crecimiento en nuevos clientes',
      value: stats.monthNewClients
    })
  }

  // Alert insights
  if (stats.pendingApprovals > 5) {
    insights.push({
      type: 'negative',
      message: 'Muchas aprobaciones pendientes',
      value: stats.pendingApprovals
    })
  }

  if (stats.overdueFollowUps > 3) {
    insights.push({
      type: 'negative',
      message: 'Seguimientos vencidos requieren atención',
      value: stats.overdueFollowUps
    })
  }

  // Performance insights
  const avgRevenuePerService = calculateRevenuePerService(stats.monthRevenue, stats.monthServices)
  if (avgRevenuePerService > 50000) {
    insights.push({
      type: 'positive',
      message: 'Alto valor promedio por servicio',
      value: avgRevenuePerService
    })
  }

  return insights
}

// Validate dashboard data
export function validateDashboardData(stats: DashboardStats): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check for negative values where they shouldn't be
  if (stats.todayRevenue < 0) errors.push('Revenue cannot be negative')
  if (stats.monthRevenue < 0) errors.push('Monthly revenue cannot be negative')
  if (stats.totalRevenue < 0) errors.push('Total revenue cannot be negative')

  // Check for reasonable limits
  if (stats.todayAppointments > 100) errors.push('Unrealistic number of appointments today')
  if (stats.monthRevenue > 100000000) errors.push('Unrealistic monthly revenue')

  // Check for missing required data
  if (stats.totalClients === 0 && stats.totalRevenue > 0) {
    errors.push('Revenue exists but no clients found')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Get dashboard summary
export function getDashboardSummary(stats: DashboardStats): {
  totalRevenue: number
  totalClients: number
  totalServices: number
  efficiency: number
  growth: number
} {
  const efficiency = calculateEfficiencyScore(
    stats.monthServices,
    stats.monthServices + stats.pendingApprovals,
    stats.monthServices - stats.pendingApprovals
  )

  const growth = calculatePercentageChange(stats.monthRevenue, stats.monthRevenue * 0.9) // Assuming 10% growth

  return {
    totalRevenue: stats.totalRevenue,
    totalClients: stats.totalClients,
    totalServices: stats.totalServices,
    efficiency,
    growth
  }
}
