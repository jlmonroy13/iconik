'use client';

import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { Button } from './Button';

interface ItemAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isDestructive?: boolean;
}

interface ItemActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ItemActions({ onEdit, onDelete }: ItemActionsProps) {
  const actions: ItemAction[] = [];

  if (onEdit) {
    actions.push({
      label: 'Editar',
      icon: <Pencil className='w-4 h-4 mr-2' />,
      onClick: onEdit,
    });
  }

  if (onDelete) {
    actions.push({
      label: 'Eliminar',
      icon: <Trash2 className='w-4 h-4 mr-2' />,
      onClick: onDelete,
      isDestructive: true,
    });
  }

  if (actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='no-ring focus:outline-none focus:ring-0 focus-visible:ring-0 active:ring-0 ring-0 outline-none'
        >
          <MoreVertical className='h-5 w-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {actions.map(action => (
          <DropdownMenuItem
            key={action.label}
            onClick={action.onClick}
            variant={action.isDestructive ? 'destructive' : 'default'}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
