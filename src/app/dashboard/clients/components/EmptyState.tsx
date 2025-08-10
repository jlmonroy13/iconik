import { Button } from '@/components/ui/Button';
import { CardContent } from '@/components/ui/Card';

interface EmptyStateProps {
  onClearFilters?: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  onClearFilters,
  title = 'No se encontraron clientes',
  description = 'Ajusta los filtros para ver más resultados',
  icon = <span className='text-2xl'>🔍</span>,
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
        {onClearFilters && (
          <Button onClick={onClearFilters} variant='outline' size='sm'>
            Limpiar Filtros
          </Button>
        )}
      </CardContent>
    </div>
  );
}
