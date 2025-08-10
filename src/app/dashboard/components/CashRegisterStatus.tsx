import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import type { CashRegister } from '../types/dashboard';

interface CashRegisterStatusProps {
  openCashRegister: CashRegister;
  todayCashTransactions: {
    cashIn: number;
    cashOut: number;
  };
}

export function CashRegisterStatus({
  openCashRegister,
  todayCashTransactions,
}: CashRegisterStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <CreditCard className='w-5 h-5' />
          Estado de Caja
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg'>
            <p className='text-sm font-medium text-green-800 dark:text-green-200'>
              Caja Abierta
            </p>
            <p className='text-lg font-bold text-green-900 dark:text-green-100'>
              {openCashRegister.cashRegister.name}
            </p>
            <p className='text-sm text-green-600'>
              Abierta por: {openCashRegister.opener.name}
            </p>
          </div>

          <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
            <p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
              Entrada de Hoy
            </p>
            <p className='text-lg font-bold text-blue-900 dark:text-blue-100'>
              {formatCurrency(todayCashTransactions.cashIn)}
            </p>
          </div>

          <div className='p-4 bg-red-50 dark:bg-red-900/20 rounded-lg'>
            <p className='text-sm font-medium text-red-800 dark:text-red-200'>
              Salida de Hoy
            </p>
            <p className='text-lg font-bold text-red-900 dark:text-red-100'>
              {formatCurrency(todayCashTransactions.cashOut)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
