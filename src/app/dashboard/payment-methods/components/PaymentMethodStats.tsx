import { StatCard } from '@/components/ui'
import { CreditCard, CheckCircle, XCircle, DollarSign, Wallet } from 'lucide-react'
import type { PaymentMethodStats } from '../types'

interface PaymentMethodStatsProps {
  stats: PaymentMethodStats
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount)
}

export function PaymentMethodStats({ stats }: PaymentMethodStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-2">
      <StatCard
        title="Total Métodos"
        value={stats.total.toString()}
        icon={<CreditCard className="text-blue-600 dark:text-blue-400" />}
        iconBgColor="bg-blue-100 dark:bg-blue-900/20"
      />
      <StatCard
        title="Activos"
        value={stats.active.toString()}
        icon={<CheckCircle className="text-green-600 dark:text-green-400" />}
        iconBgColor="bg-green-100 dark:bg-green-900/20"
      />
      <StatCard
        title="Inactivos"
        value={stats.inactive.toString()}
        icon={<XCircle className="text-gray-500 dark:text-gray-400" />}
        iconBgColor="bg-gray-100 dark:bg-gray-900/20"
      />
      <StatCard
        title="Pagos Totales"
        value={stats.totalPayments.toString()}
        icon={<DollarSign className="text-yellow-600 dark:text-yellow-400" />}
        iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
      />
      <StatCard
        title="Monto Total"
        value={formatCurrency(stats.totalAmount)}
        icon={<Wallet className="text-indigo-600 dark:text-indigo-400" />}
        iconBgColor="bg-indigo-100 dark:bg-indigo-900/20"
      />
    </div>
  )
}
