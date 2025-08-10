import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui';
import {
  TrendingUp,
  Receipt,
  PiggyBank,
  Target,
  BarChart3,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface FinancialOverviewProps {
  monthRevenue: number;
  monthlyExpenses: number;
  commissionPayments: number;
}

export function FinancialOverview({
  monthRevenue,
  monthlyExpenses,
  commissionPayments,
}: FinancialOverviewProps) {
  const netBalance = monthRevenue - monthlyExpenses - commissionPayments;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BarChart3 className='w-5 h-5' />
          Resumen Financiero
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            title='Ingresos del Mes'
            value={formatCurrency(monthRevenue)}
            icon={<TrendingUp className='text-green-600' />}
            iconBgColor='bg-green-100 dark:bg-green-900/20'
          />
          <StatCard
            title='Gastos del Mes'
            value={formatCurrency(monthlyExpenses)}
            icon={<Receipt className='text-red-600' />}
            iconBgColor='bg-red-100 dark:bg-red-900/20'
          />
          <StatCard
            title='Comisiones del Mes'
            value={formatCurrency(commissionPayments)}
            icon={<PiggyBank className='text-orange-600' />}
            iconBgColor='bg-orange-100 dark:bg-orange-900/20'
          />
          <StatCard
            title='Balance Neto'
            value={formatCurrency(netBalance)}
            icon={<Target className='text-indigo-600' />}
            iconBgColor='bg-indigo-100 dark:bg-indigo-900/20'
          />
        </div>
      </CardContent>
    </Card>
  );
}
