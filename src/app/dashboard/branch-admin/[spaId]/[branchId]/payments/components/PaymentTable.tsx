'use client';

import { Table } from '@/components/ui';
import { Badge } from '@/components/ui';
import { ItemActions } from '@/components/ui/ItemActions';
import type { PaymentListItem } from '@/types/payments';

interface PaymentTableProps {
  payments: PaymentListItem[];
  onView: (payment: PaymentListItem) => void;
}

export function PaymentTable({ payments, onView }: PaymentTableProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  // Get commission status badge
  const getCommissionStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'Pendiente', variant: 'warning' as const },
      PAID: { label: 'Pagada', variant: 'success' as const },
      CANCELLED: { label: 'Cancelada', variant: 'default' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: 'default' as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Documento</th>
            <th>Método de Pago</th>
            <th>Monto Original</th>
            <th>Descuento</th>
            <th>Monto Final</th>
            <th>Comisión</th>
            <th>Estado Comisión</th>
            <th>Servicios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td className="whitespace-nowrap">
                {formatDate(payment.paidAt)}
              </td>
              <td className="font-medium">{payment.client.name}</td>
              <td className="text-sm text-gray-600">
                {payment.client.documentType} {payment.client.documentNumber}
              </td>
              <td>
                <div className="flex items-center gap-2">
                  {payment.paymentMethod.icon && (
                    <span>{payment.paymentMethod.icon}</span>
                  )}
                  <span>{payment.paymentMethod.name}</span>
                </div>
              </td>
              <td className="text-right">
                {formatCurrency(payment.originalAmount)}
              </td>
              <td className="text-right">
                {payment.discountAmount > 0 ? (
                  <span className="text-red-600">
                    -{formatCurrency(payment.discountAmount)}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="text-right font-semibold">
                {formatCurrency(payment.amount)}
              </td>
              <td className="text-right">
                {payment.commission ? (
                  <span className="text-green-600">
                    {formatCurrency(payment.commission.commissionAmount)}
                  </span>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td>
                {payment.commission ? (
                  getCommissionStatusBadge(payment.commission.status)
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="text-center">
                <Badge variant="default">{payment.servicesCount}</Badge>
              </td>
              <td>
                <ItemActions
                  onView={() => onView(payment)}
                  viewLabel="Ver Detalles"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
