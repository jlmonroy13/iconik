import { prisma } from '@/lib/prisma'
import { auth } from '@/../../auth'
import { redirect } from 'next/navigation'
import type { DashboardStats } from '@/app/dashboard/types/dashboard'

export async function getDashboardStats(): Promise<DashboardStats> {
  const session = await auth()
  if (!session?.user?.spaId) {
    redirect('/onboarding')
  }

  const spaId = session.user.spaId
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const [
    // Today's stats
    todayAppointments,
    todayRevenue,
    todayServices,
    todayClients,

    // Week stats
    weekRevenue,
    weekServices,
    weekNewClients,

    // Month stats
    monthRevenue,
    monthServices,
    monthNewClients,

    // Overall stats
    totalClients,
    totalServices,
    totalRevenue,

    // Pending items
    pendingApprovals,
    pendingPreConfirmations,
    upcomingAppointments,

    // Recent activity
    recentPayments,
    recentAppointments,

    // Cash register status
    openCashRegister,
    todayCashTransactions,

    // Top performing manicurists
    topManicurists,

    // Popular services
    popularServices,

    // Financial overview
    monthlyExpenses,
    commissionPayments,

    // Alerts
    overdueFollowUps,
    lowStockAlerts,

    // Active sales goals
    activeSalesGoals
  ] = await Promise.all([
    // Today's appointments
    prisma.appointment.count({
      where: {
        spaId,
        scheduledAt: { gte: startOfToday, lte: endOfToday }
      }
    }),

    // Today's revenue
    prisma.payment.aggregate({
      where: {
        spaId,
        paidAt: { gte: startOfToday, lte: endOfToday }
      },
      _sum: { amount: true }
    }),

    // Today's services completed
    prisma.appointmentService.count({
      where: {
        appointment: { spaId },
        endedAtByAdmin: { gte: startOfToday, lte: endOfToday }
      }
    }),

    // Today's unique clients
    prisma.appointment.groupBy({
      by: ['clientId'],
      where: {
        spaId,
        scheduledAt: { gte: startOfToday, lte: endOfToday }
      }
    }),

    // Week revenue
    prisma.payment.aggregate({
      where: {
        spaId,
        paidAt: { gte: startOfWeek }
      },
      _sum: { amount: true }
    }),

    // Week services
    prisma.appointmentService.count({
      where: {
        appointment: { spaId },
        endedAtByAdmin: { gte: startOfWeek }
      }
    }),

    // Week new clients
    prisma.client.count({
      where: {
        spaId,
        createdAt: { gte: startOfWeek }
      }
    }),

    // Month revenue
    prisma.payment.aggregate({
      where: {
        spaId,
        paidAt: { gte: startOfMonth }
      },
      _sum: { amount: true }
    }),

    // Month services
    prisma.appointmentService.count({
      where: {
        appointment: { spaId },
        endedAtByAdmin: { gte: startOfMonth }
      }
    }),

    // Month new clients
    prisma.client.count({
      where: {
        spaId,
        createdAt: { gte: startOfMonth }
      }
    }),

    // Total clients
    prisma.client.count({ where: { spaId } }),

    // Total services
    prisma.appointmentService.count({
      where: { appointment: { spaId } }
    }),

    // Total revenue
    prisma.payment.aggregate({
      where: { spaId },
      _sum: { amount: true }
    }),

    // Pending approvals
    prisma.appointment.count({
      where: {
        spaId,
        requiresApproval: true,
        approvedBy: null
      }
    }),

    // Pending pre-confirmations
    prisma.appointment.count({
      where: {
        spaId,
        requiresPreConfirmation: true,
        preConfirmedBy: null,
        scheduledAt: { gte: new Date() }
      }
    }),

    // Upcoming appointments (next 7 days)
    prisma.appointment.findMany({
      where: {
        spaId,
        scheduledAt: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
      },
      include: {
        client: true,
        manicurist: true,
        services: { include: { service: true } }
      },
      orderBy: { scheduledAt: 'asc' },
      take: 5
    }),

    // Recent payments
    prisma.payment.findMany({
      where: { spaId },
      include: {
        appointment: { include: { client: true } },
        paymentMethod: true
      },
      orderBy: { paidAt: 'desc' },
      take: 5
    }),

    // Recent appointments
    prisma.appointment.findMany({
      where: { spaId },
      include: {
        client: true,
        manicurist: true,
        services: { include: { service: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),

    // Open cash register
    prisma.cashRegisterShift.findFirst({
      where: {
        spa: { id: spaId },
        status: 'OPEN'
      },
      include: {
        cashRegister: true,
        opener: true
      }
    }),

    // Today's cash transactions
    prisma.cashRegisterTransaction.aggregate({
      where: {
        spaId,
        createdAt: { gte: startOfToday, lte: endOfToday }
      },
      _sum: { cashIn: true, cashOut: true }
    }),

    // Top performing manicurists (this month)
    prisma.appointmentService.groupBy({
      by: ['manicuristId'],
      where: {
        appointment: { spaId },
        endedAtByAdmin: { gte: startOfMonth }
      },
      _count: { id: true },
      _sum: { price: true },
      orderBy: { _sum: { price: 'desc' } },
      take: 3
    }),

    // Popular services (this month)
    prisma.appointmentService.groupBy({
      by: ['serviceId'],
      where: {
        appointment: { spaId },
        endedAtByAdmin: { gte: startOfMonth }
      },
      _count: { id: true },
      _sum: { price: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    }),

    // Monthly expenses
    prisma.expensePayment.aggregate({
      where: {
        spaId,
        paidAt: { gte: startOfMonth }
      },
      _sum: { amount: true }
    }),

    // Commission payments (this month)
    prisma.commission.aggregate({
      where: {
        spaId,
        createdAt: { gte: startOfMonth }
      },
      _sum: { commissionAmount: true }
    }),

    // Overdue follow-ups
    prisma.clientServiceHistory.count({
      where: {
        spaId,
        recommendedReturnDate: { lt: new Date() },
        isFollowedUp: false
      }
    }),

    // Low stock alerts (placeholder - would need inventory system)
    Promise.resolve(0),

    // Active sales goals
    prisma.salesGoal.findMany({
      where: {
        spaId,
        isActive: true
      },
      include: {
        manicurist: {
          select: { name: true }
        },
        service: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  // Get manicurist details for top performers
  const manicuristIds = topManicurists.map(m => m.manicuristId)
  const manicuristDetails = await prisma.manicurist.findMany({
    where: { id: { in: manicuristIds } },
    select: { id: true, name: true }
  })

  // Get service details for popular services
  const serviceIds = popularServices.map(s => s.serviceId)
  const serviceDetails = await prisma.service.findMany({
    where: { id: { in: serviceIds } },
    select: { id: true, name: true, type: true }
  })

  return {
    // Today's stats
    todayAppointments,
    todayRevenue: todayRevenue._sum.amount || 0,
    todayServices,
    todayClients: todayClients.length,

    // Week stats
    weekRevenue: weekRevenue._sum.amount || 0,
    weekServices,
    weekNewClients,

    // Month stats
    monthRevenue: monthRevenue._sum.amount || 0,
    monthServices,
    monthNewClients,

    // Overall stats
    totalClients,
    totalServices,
    totalRevenue: totalRevenue._sum.amount || 0,

    // Pending items
    pendingApprovals,
    pendingPreConfirmations,
    upcomingAppointments: upcomingAppointments as DashboardStats['upcomingAppointments'],

    // Recent activity
    recentPayments: recentPayments as DashboardStats['recentPayments'],
    recentAppointments: recentAppointments as DashboardStats['recentAppointments'],

    // Cash register
    openCashRegister: openCashRegister as DashboardStats['openCashRegister'],
    todayCashTransactions: {
      cashIn: todayCashTransactions._sum.cashIn || 0,
      cashOut: todayCashTransactions._sum.cashOut || 0
    },

    // Top performers
    topManicurists: topManicurists.map(m => ({
      ...m,
      manicurist: manicuristDetails.find(d => d.id === m.manicuristId),
      _sum: { price: m._sum.price || 0 }
    })) as DashboardStats['topManicurists'],

    // Popular services
    popularServices: popularServices.map(s => ({
      ...s,
      service: serviceDetails.find(d => d.id === s.serviceId),
      _sum: { price: s._sum.price || 0 }
    })) as DashboardStats['popularServices'],

    // Financial
    monthlyExpenses: monthlyExpenses._sum.amount || 0,
    commissionPayments: commissionPayments._sum.commissionAmount || 0,

    // Alerts
    overdueFollowUps,
    lowStockAlerts,

    // Active sales goals
    activeSalesGoals: activeSalesGoals as DashboardStats['activeSalesGoals']
  }
}
