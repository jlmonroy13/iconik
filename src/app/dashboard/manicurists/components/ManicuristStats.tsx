import { StatCard } from '@/components/ui';
import { Users, UserCheck, UserX, Star } from 'lucide-react';

interface ManicuristStatsProps {
  stats: {
    total: number;
    active?: number;
    inactive?: number;
    bestRated?: string;
  };
}

export function ManicuristStats({ stats }: ManicuristStatsProps) {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-2'>
      <StatCard
        title='Total Manicuristas'
        value={stats.total.toString()}
        icon={<Users className='text-blue-600 dark:text-blue-400' />}
        iconBgColor='bg-blue-100 dark:bg-blue-900/20'
      />
      <StatCard
        title='Activos'
        value={
          typeof stats.active === 'number' ? stats.active.toString() : 'N/A'
        }
        icon={<UserCheck className='text-green-600 dark:text-green-400' />}
        iconBgColor='bg-green-100 dark:bg-green-900/20'
      />
      <StatCard
        title='Inactivos'
        value={
          typeof stats.inactive === 'number' ? stats.inactive.toString() : 'N/A'
        }
        icon={<UserX className='text-gray-500 dark:text-gray-400' />}
        iconBgColor='bg-gray-100 dark:bg-gray-900/20'
      />
      <StatCard
        title='Mejor Calificada'
        value={stats.bestRated || 'N/A'}
        icon={<Star className='text-yellow-600 dark:text-yellow-400' />}
        iconBgColor='bg-yellow-100 dark:bg-yellow-900/20'
      />
    </div>
  );
}
