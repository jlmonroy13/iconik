'use client';

import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import type { ClientWithAppointmentCount } from '@/types/clients';

interface ClientTableProps {
  clients: ClientWithAppointmentCount[];
  onEdit: (client: ClientWithAppointmentCount) => void;
  onDelete: (client: ClientWithAppointmentCount) => void;
}

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  const formatBirthday = (birthday: Date | null) => {
    if (!birthday) return '-';
    return format(new Date(birthday), 'dd/MM/yyyy');
  };

  const getDocumentTypeLabel = (type: string) => {
    const documentTypes = {
      CC: 'Cédula',
      TI: 'Tarjeta de Identidad',
      CE: 'Cédula de Extranjería',
      PA: 'Pasaporte',
      NIT: 'NIT',
    };
    return documentTypes[type as keyof typeof documentTypes] || type;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Fecha de Nacimiento</TableHead>
            <TableHead>Citas</TableHead>
            <TableHead>Registrado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map(client => (
            <TableRow key={client.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{client.name}</div>
                  {client.notes && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {client.notes}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {getDocumentTypeLabel(client.documentType)}
                  </div>
                  <div className="font-mono text-sm">
                    {client.documentNumber}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {client.email && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        📧
                      </span>
                      <span className="ml-1">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        📞
                      </span>
                      <span className="ml-1">{client.phone}</span>
                    </div>
                  )}
                  {!client.email && !client.phone && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Sin contacto
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {formatBirthday(client.birthday)}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    client._count.appointments > 0 ? 'default' : 'secondary'
                  }
                >
                  {client._count.appointments} cita
                  {client._count.appointments !== 1 ? 's' : ''}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(client.createdAt)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <IconButton
                    onClick={() => onEdit(client)}
                    variant="ghost"
                    size="sm"
                    icon="✏️"
                    label="Editar cliente"
                  />
                  <IconButton
                    onClick={() => onDelete(client)}
                    variant="ghost"
                    size="sm"
                    icon="🗑️"
                    label="Eliminar cliente"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
