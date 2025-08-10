import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui';
import {
  Calendar,
  DollarSign,
  CheckCircle,
  Users,
  Activity,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface TodayOverviewProps {
  todayAppointments: number;
  todayRevenue: number;
  todayServices: number;
  todayClients: number;
}

export function TodayOverview({
  todayAppointments,
  todayRevenue,
  todayServices,
  todayClients,
}: TodayOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Activity className='w-5 h-5' />
          Resumen de Hoy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            title='Citas Hoy'
            value={todayAppointments}
            icon={<Calendar className='text-blue-600' />}
            iconBgColor='bg-blue-100 dark:bg-blue-900/20'
          />
          <StatCard
            title='Ingresos Hoy'
            value={formatCurrency(todayRevenue)}
            icon={<DollarSign className='text-green-600' />}
            iconBgColor='bg-green-100 dark:bg-green-900/20'
          />
          <StatCard
            title='Servicios Completados'
            value={todayServices}
            icon={<CheckCircle className='text-purple-600' />}
            iconBgColor='bg-purple-100 dark:bg-purple-900/20'
          />
          <StatCard
            title='Clientes Únicos'
            value={todayClients}
            icon={<Users className='text-pink-600' />}
            iconBgColor='bg-pink-100 dark:bg-pink-900/20'
          />
        </div>
      </CardContent>
    </Card>
  );
}
