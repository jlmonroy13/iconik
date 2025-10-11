'use client';

import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import type { ManicuristWithCounts } from '@/types/manicurists';

interface ManicuristTableProps {
  manicurists: ManicuristWithCounts[];
  totalServicesCount: number;
  onEdit: (manicurist: ManicuristWithCounts) => void;
  onDelete: (manicurist: ManicuristWithCounts) => void;
  onManageServices: (manicurist: ManicuristWithCounts) => void;
  onManageSchedule: (manicurist: ManicuristWithCounts) => void;
  onManageAvailability: (manicurist: ManicuristWithCounts) => void;
}

export function ManicuristTable({
  manicurists,
  totalServicesCount,
  onEdit,
  onDelete,
  onManageServices,
  onManageSchedule,
  onManageAvailability,
}: ManicuristTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const getScheduleBadge = (schedulesCount: number) => {
    if (schedulesCount === 0) {
      return <Badge variant="destructive">❌ Sin horario</Badge>;
    }
    if (schedulesCount < 5) {
      return (
        <Badge variant="warning">⚠️ Parcial ({schedulesCount} días)</Badge>
      );
    }
    return <Badge variant="success">✅ Completo</Badge>;
  };

  const getServicesIndicator = (assignedCount: number) => {
    const percentage = (assignedCount / totalServicesCount) * 100;
    const colorClass =
      percentage > 66
        ? 'bg-green-500'
        : percentage > 33
          ? 'bg-yellow-500'
          : 'bg-red-500';

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {assignedCount}/{totalServicesCount}
        </span>
        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${colorClass}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  const toggleMenu = (id: string) => {
    if (openMenuId === id) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const button = buttonRefs.current[id];
      if (button) {
        const rect = button.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY + 8,
          right: window.innerWidth - rect.right + window.scrollX,
        });
      }
      setOpenMenuId(id);
    }
  };

  const handleAction = (action: () => void) => {
    setOpenMenuId(null);
    setMenuPosition(null);
    action();
  };

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (openMenuId) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [openMenuId]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Comisión</TableHead>
            <TableHead>Servicios</TableHead>
            <TableHead>Horario</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {manicurists.map(manicurist => (
            <TableRow key={manicurist.id}>
              <TableCell className="font-medium">{manicurist.name}</TableCell>
              <TableCell>{manicurist.phone || '-'}</TableCell>
              <TableCell>{manicurist.email || '-'}</TableCell>
              <TableCell>{Math.round(manicurist.commission * 100)}%</TableCell>
              <TableCell>
                {getServicesIndicator(manicurist._count.manicuristServices)}
              </TableCell>
              <TableCell>
                {getScheduleBadge(manicurist._count.schedules)}
              </TableCell>
              <TableCell>
                {manicurist.isActive ? (
                  <Badge variant="success">Activa</Badge>
                ) : (
                  <Badge variant="destructive">Inactiva</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  ref={el => {
                    buttonRefs.current[manicurist.id] = el;
                  }}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleMenu(manicurist.id)}
                  className="px-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dropdown Menu - Fixed Position */}
      {openMenuId && menuPosition && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setOpenMenuId(null);
              setMenuPosition(null);
            }}
          />
          <div
            className="fixed w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
            style={{
              top: `${menuPosition.top}px`,
              right: `${menuPosition.right}px`,
            }}
          >
            <div className="py-1">
              {manicurists
                .filter(m => m.id === openMenuId)
                .map(manicurist => (
                  <div key={manicurist.id}>
                    <button
                      onClick={() => handleAction(() => onEdit(manicurist))}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      ✏️ Editar Información
                    </button>
                    <button
                      onClick={() =>
                        handleAction(() => onManageServices(manicurist))
                      }
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      🎯 Gestionar Servicios
                    </button>
                    <button
                      onClick={() =>
                        handleAction(() => onManageSchedule(manicurist))
                      }
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      ⏰ Configurar Horario
                    </button>
                    <button
                      onClick={() =>
                        handleAction(() => onManageAvailability(manicurist))
                      }
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      📅 Excepciones
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                    <button
                      onClick={() => handleAction(() => onDelete(manicurist))}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
