'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';

interface SalesGoal {
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

interface SalesGoalsOverviewProps {
  goals: SalesGoal[];
}

const GOAL_TYPE_LABELS = {
  REVENUE: 'Ingresos',
  SERVICES: 'Servicios',
  CLIENTS: 'Clientes',
  APPOINTMENTS: 'Citas',
};

const PERIOD_LABELS = {
  DAILY: 'Hoy',
  WEEKLY: 'Esta semana',
  MONTHLY: 'Este mes',
  QUARTERLY: 'Este trimestre',
  YEARLY: 'Este año',
};

export function SalesGoalsOverview({ goals }: SalesGoalsOverviewProps) {
  // Filter only active goals
  const activeGoals = goals.filter(goal => goal.isActive);

  if (activeGoals.length === 0) {
    return null;
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-600';
    if (progress >= 75) return 'text-yellow-600';
    if (progress >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-yellow-500';
    if (progress >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (progress: number) => {
    if (progress >= 100)
      return <TrendingUp className='w-4 h-4 text-green-600' />;
    if (progress >= 75)
      return <TrendingUp className='w-4 h-4 text-yellow-600' />;
    return <TrendingDown className='w-4 h-4 text-red-600' />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Target className='w-5 h-5 text-blue-600' />
          Metas de Ventas
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {activeGoals.map(goal => {
          const progress = getProgressPercentage(
            goal.currentAmount,
            goal.targetAmount
          );
          const isOverdue =
            goal.endDate && new Date() > goal.endDate && progress < 100;

          return (
            <div key={goal.id} className='space-y-2'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <h4 className='font-medium text-sm text-gray-900 dark:text-white'>
                    {goal.name}
                  </h4>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    {GOAL_TYPE_LABELS[goal.type]} • {PERIOD_LABELS[goal.period]}
                    {goal.manicurist && ` • ${goal.manicurist.name}`}
                    {goal.service && ` • ${goal.service.name}`}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  {getTrendIcon(progress)}
                  <span
                    className={`text-sm font-medium ${getProgressColor(progress)}`}
                  >
                    {progress.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className='flex items-center justify-between text-xs text-gray-600 dark:text-gray-400'>
                <span>
                  {goal.type === 'REVENUE'
                    ? formatCurrency(goal.currentAmount)
                    : goal.currentAmount.toLocaleString()}
                  {' / '}
                  {goal.type === 'REVENUE'
                    ? formatCurrency(goal.targetAmount)
                    : goal.targetAmount.toLocaleString()}
                </span>
                {isOverdue && (
                  <span className='text-red-600 font-medium'>Vencida</span>
                )}
              </div>

              {/* Progress bar */}
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className={`h-2 rounded-full transition-all ${getProgressBarColor(progress)}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
