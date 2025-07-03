import { PageTransition, FadeIn } from '@/components/ui'
import { PartyPopper } from 'lucide-react'
import type { Metadata } from 'next'
import { getDashboardStats } from '@/services/dashboard'
import {
  TodayOverview,
  FinancialOverview,
  AlertsSection,
  UpcomingAppointments,
  RecentPayments,
  TopPerformers,
  PopularServices,
  CashRegisterStatus
} from './components'

export const metadata: Metadata = {
  title: 'Dashboard - Iconik',
  description: 'Panel principal con estadísticas y resumen de tu spa de uñas. Visualiza servicios, ingresos, clientes y citas.',
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <PageTransition className="h-full">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex-shrink-0">
          <FadeIn>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Dashboard <PartyPopper className="text-yellow-500" />
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Resumen completo de tu spa de uñas
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto pr-2 min-h-0">
          <div className="space-y-6">

            {/* Today's Overview */}
            <FadeIn delay={100}>
              <TodayOverview
                todayAppointments={stats.todayAppointments}
                todayRevenue={stats.todayRevenue}
                todayServices={stats.todayServices}
                todayClients={stats.todayClients}
              />
            </FadeIn>

            {/* Financial Overview */}
            <FadeIn delay={200}>
              <FinancialOverview
                monthRevenue={stats.monthRevenue}
                monthlyExpenses={stats.monthlyExpenses}
                commissionPayments={stats.commissionPayments}
              />
            </FadeIn>

            {/* Alerts & Pending Items */}
            <FadeIn delay={300}>
              <AlertsSection
                pendingApprovals={stats.pendingApprovals}
                pendingPreConfirmations={stats.pendingPreConfirmations}
                overdueFollowUps={stats.overdueFollowUps}
              />
            </FadeIn>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {/* Upcoming Appointments */}
              <FadeIn delay={400}>
                <UpcomingAppointments appointments={stats.upcomingAppointments} />
              </FadeIn>

              {/* Recent Payments */}
              <FadeIn delay={500}>
                <RecentPayments payments={stats.recentPayments} />
              </FadeIn>
            </div>

            {/* Top Performers & Popular Services */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {/* Top Manicurists */}
              <FadeIn delay={600}>
                <TopPerformers manicurists={stats.topManicurists} />
              </FadeIn>

              {/* Popular Services */}
              <FadeIn delay={700}>
                <PopularServices services={stats.popularServices} />
              </FadeIn>
            </div>

            {/* Cash Register Status */}
            {stats.openCashRegister && (
              <FadeIn delay={800}>
                <CashRegisterStatus
                  openCashRegister={stats.openCashRegister}
                  todayCashTransactions={stats.todayCashTransactions}
                />
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
