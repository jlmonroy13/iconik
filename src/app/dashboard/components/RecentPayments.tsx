import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  EmptyState,
} from '@/components/ui';
import { CreditCard } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import type { Payment } from '../types/dashboard';

interface RecentPaymentsProps {
  payments: Payment[];
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
          <div className='space-y-3'>
            {payments.map(payment => (
              <div
                key={payment.id}
                className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
              >
                <div className='flex-1'>
                  <p className='font-medium text-gray-900 dark:text-white'>
                    {payment.appointment?.client.name || 'Pago directo'}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {payment.paymentMethod.name} • {formatDate(payment.paidAt)}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='font-medium text-green-600 dark:text-green-400'>
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title='No hay pagos recientes'
            description='Los pagos realizados aparecerán aquí.'
            icon={<CreditCard className='w-8 h-8' />}
          />
        )}
      </CardContent>
    </Card>
  );
}
