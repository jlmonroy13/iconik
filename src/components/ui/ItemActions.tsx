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
  onClick: () => void;
  variant?: 'default' | 'danger';
  icon?: React.ReactNode;
}

interface ItemActionsProps {
  actions?: ItemAction[];
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

export function ItemActions({
  actions,
  onEdit,
  onDelete,
  disabled = false,
}: ItemActionsProps) {
  let finalActions: ItemAction[] = [];

  // If actions array is provided, use it
  if (actions && actions.length > 0) {
    finalActions = actions;
  } else {
    // Otherwise, use legacy onEdit/onDelete props
    if (onEdit) {
      finalActions.push({
        label: 'Editar',
        icon: <Pencil className="w-4 h-4" />,
        onClick: onEdit,
      });
    }

    if (onDelete) {
      finalActions.push({
        label: 'Eliminar',
        icon: <Trash2 className="w-4 h-4" />,
        onClick: onDelete,
        variant: 'danger',
      });
    }
  }

  if (finalActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="no-ring focus:outline-none focus:ring-0 focus-visible:ring-0 active:ring-0 ring-0 outline-none"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {finalActions.map((action, index) => (
          <DropdownMenuItem
            key={`${action.label}-${index}`}
            onClick={action.onClick}
            variant={action.variant === 'danger' ? 'destructive' : 'default'}
            disabled={disabled}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
