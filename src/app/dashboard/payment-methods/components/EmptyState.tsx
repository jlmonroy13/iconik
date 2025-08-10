import { CardContent } from '@/components/ui/Card';
import { CreditCard } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No se encontraron métodos de pago',
  description = 'Aún no has registrado métodos de pago',
  icon = <CreditCard className='w-8 h-8 text-blue-500' />,
}: EmptyStateProps) {
  return (
    <div>
      <CardContent className='p-8 text-center'>
        <div className='w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4'>
          {icon}
        </div>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
          {title}
        </h3>
        <p className='text-gray-500 dark:text-gray-400 mb-4'>{description}</p>
      </CardContent>
    </div>
  );
}
