import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  EmptyState,
} from '@/components/ui';
import { Users } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import type { TopManicurist } from '../types/dashboard';

interface TopPerformersProps {
  manicurists: TopManicurist[];
}

export function TopPerformers({ manicurists }: TopPerformersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Manicuristas del Mes</CardTitle>
      </CardHeader>
      <CardContent>
        {manicurists.length > 0 ? (
          <div className='space-y-3'>
            {manicurists.map((manicurist, index) => (
              <div
                key={manicurist.manicuristId}
                className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm'>
                    {index + 1}
                  </div>
                  <div>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {manicurist.manicurist?.name}
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {manicurist._count.id} servicios
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-medium text-green-600 dark:text-green-400'>
                    {formatCurrency(manicurist._sum.price || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title='No hay datos de manicuristas'
            description='Los datos de rendimiento aparecerán aquí.'
            icon={<Users className='w-8 h-8' />}
          />
        )}
      </CardContent>
    </Card>
  );
}
