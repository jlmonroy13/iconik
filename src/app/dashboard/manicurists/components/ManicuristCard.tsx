import { Avatar } from '@/components/ui';
import { Pencil, Trash2 } from 'lucide-react';
import type { Manicurist } from '../types';

interface ManicuristCardProps {
  manicurist: Manicurist;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ManicuristCard({
  manicurist,
  onEdit,
  onDelete,
}: ManicuristCardProps) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4'>
      <div className='flex items-start gap-4'>
        {/* Avatar and basic info */}
        <div className='flex items-center gap-4'>
          <Avatar fallback={manicurist.name.charAt(0)} />
          <div>
            <div className='flex items-center gap-2'>
              <h3 className='font-medium text-gray-900 dark:text-white'>
                {manicurist.name}
              </h3>
              {!manicurist.isActive && (
                <span className='px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full'>
                  Inactiva
                </span>
              )}
            </div>
            {manicurist.email && (
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {manicurist.email}
              </p>
            )}
            {manicurist.phone && (
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {manicurist.phone}
              </p>
            )}
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
              Comisión: {(manicurist.commission * 100).toFixed(0)}%
            </p>
          </div>
        </div>
        {/* Action buttons */}
        <div className='ml-auto flex items-center gap-1 self-center'>
          {onEdit && (
            <button
              onClick={onEdit}
              className='p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors'
              title='Editar'
            >
              <span className='sr-only'>Editar</span>
              <Pencil className='w-4 h-4' />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className='p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors'
              title='Eliminar'
            >
              <span className='sr-only'>Eliminar</span>
              <Trash2 className='w-4 h-4' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
