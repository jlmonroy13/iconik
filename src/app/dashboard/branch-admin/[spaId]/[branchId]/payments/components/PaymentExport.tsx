'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Spinner } from '@/components/ui/Spinner';
import type { PaymentListItem, PaymentStats } from '@/types/payments';

interface PaymentExportProps {
  payments: PaymentListItem[];
  stats: PaymentStats;
  dateFrom?: Date;
  dateTo?: Date;
  branchName: string;
  spaName: string;
}

export function PaymentExport({
  payments,
  stats,
  dateFrom,
  dateTo,
  branchName,
  spaName,
}: PaymentExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Format currency for export
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Format date for export
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Export payments to CSV
  const exportPaymentsToCSV = () => {
    setIsExporting(true);

    try {
      // CSV Headers
      const headers = [
        'Fecha',
        'Cliente',
        'Documento',
        'Método de Pago',
        'Monto Original',
        'Descuento',
        'Razón Descuento',
        'Comisión Transacción',
        'Monto Final',
        'Manicurista',
        'Comisión Generada',
        'Estado Comisión',
        'Servicios',
        'Referencia',
      ];

      // CSV Rows
      const rows = payments.map(payment => [
        formatDate(payment.paidAt),
        `"${payment.client.name}"`,
        `${payment.client.documentType} ${payment.client.documentNumber}`,
        `"${payment.paymentMethod.name}"`,
        formatCurrency(payment.originalAmount),
        formatCurrency(payment.discountAmount),
        payment.discountReason ? `"${payment.discountReason}"` : '',
        formatCurrency(payment.transactionFeeAmount),
        formatCurrency(payment.amount),
        payment.commission ? `"${payment.commission.manicuristName}"` : 'N/A',
        payment.commission
          ? formatCurrency(payment.commission.commissionAmount)
          : '0',
        payment.commission ? payment.commission.status : 'N/A',
        payment.servicesCount.toString(),
        payment.reference ? `"${payment.reference}"` : '',
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');

      // Create and download file
      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const fileName = `pagos_${spaName.replace(/\s+/g, '_')}_${branchName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('Error al exportar el archivo CSV');
    } finally {
      setIsExporting(false);
    }
  };

  // Export summary report to CSV
  const exportSummaryToCSV = () => {
    setIsExporting(true);

    try {
      const periodText =
        dateFrom && dateTo
          ? `${dateFrom.toLocaleDateString('es-CO')} - ${dateTo.toLocaleDateString('es-CO')}`
          : dateFrom
            ? `Desde ${dateFrom.toLocaleDateString('es-CO')}`
            : dateTo
              ? `Hasta ${dateTo.toLocaleDateString('es-CO')}`
              : 'Todo el período';

      const summaryData = [
        ['RESUMEN DE PAGOS'],
        ['Spa', spaName],
        ['Sede', branchName],
        ['Período', periodText],
        ['Fecha de Reporte', new Date().toLocaleString('es-CO')],
        [''],
        ['TOTALES GENERALES'],
        ['Total Recaudado', formatCurrency(stats.totalAmount)],
        ['Número de Pagos', stats.totalPayments.toString()],
        ['Ticket Promedio', formatCurrency(stats.averagePayment)],
        [''],
        ['COMISIONES'],
        ['Comisiones Generadas', formatCurrency(stats.commissionsGenerated)],
        ['Comisiones Pendientes', formatCurrency(stats.commissionsPending)],
        ['Comisiones Pagadas', formatCurrency(stats.commissionsPaid)],
        ['Comisiones Canceladas', formatCurrency(stats.commissionsCancelled)],
        [''],
        ['OTROS'],
        ['Descuentos Aplicados', formatCurrency(stats.discountsApplied)],
        [
          'Comisiones de Transacción',
          formatCurrency(stats.transactionFeesTotal),
        ],
        [''],
        ['DISTRIBUCIÓN POR MÉTODO DE PAGO'],
        ['Método', 'Monto', 'Cantidad', 'Porcentaje'],
      ];

      stats.byPaymentMethod.forEach(method => {
        summaryData.push([
          method.methodName,
          formatCurrency(method.amount),
          method.count.toString(),
          `${method.percentage.toFixed(2)}%`,
        ]);
      });

      const csvContent = summaryData.map(row => row.join(',')).join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const fileName = `resumen_pagos_${spaName.replace(/\s+/g, '_')}_${branchName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('Error al exportar el resumen');
    } finally {
      setIsExporting(false);
    }
  };

  // Export commissions report
  const exportCommissionsToCSV = () => {
    setIsExporting(true);

    try {
      // Group by manicurist
      const commissionsByManicurist = new Map<
        string,
        {
          name: string;
          total: number;
          pending: number;
          paid: number;
          count: number;
        }
      >();

      payments.forEach(payment => {
        if (!payment.commission) return;

        const { manicuristId, manicuristName, commissionAmount, status } =
          payment.commission;

        let data = commissionsByManicurist.get(manicuristId);
        if (!data) {
          data = {
            name: manicuristName,
            total: 0,
            pending: 0,
            paid: 0,
            count: 0,
          };
          commissionsByManicurist.set(manicuristId, data);
        }

        data.total += commissionAmount;
        data.count++;

        if (status === 'PENDING') {
          data.pending += commissionAmount;
        } else if (status === 'PAID') {
          data.paid += commissionAmount;
        }
      });

      const headers = [
        'Manicurista',
        'Total Comisiones',
        'Comisiones Pendientes',
        'Comisiones Pagadas',
        'Número de Servicios',
        'Promedio por Servicio',
      ];

      const rows = Array.from(commissionsByManicurist.values())
        .sort((a, b) => b.total - a.total)
        .map(data => [
          `"${data.name}"`,
          formatCurrency(data.total),
          formatCurrency(data.pending),
          formatCurrency(data.paid),
          data.count.toString(),
          formatCurrency(data.total / data.count),
        ]);

      const csvContent = [
        ['REPORTE DE COMISIONES'],
        ['Spa', spaName],
        ['Sede', branchName],
        ['Fecha de Reporte', new Date().toLocaleString('es-CO')],
        [''],
        headers,
        ...rows,
      ]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      const fileName = `comisiones_${spaName.replace(/\s+/g, '_')}_${branchName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('Error al exportar el reporte de comisiones');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Reportes</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Descarga reportes detallados en formato CSV para análisis externo
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Export Payments */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">📊</span>
              <div>
                <h3 className="font-semibold">Listado Detallado</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Todos los pagos con detalle completo
                </p>
              </div>
            </div>
            <Button
              onClick={exportPaymentsToCSV}
              disabled={isExporting || payments.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isExporting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Exportando...
                </>
              ) : (
                `Exportar ${payments.length} Pago${payments.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </div>

          {/* Export Summary */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">📈</span>
              <div>
                <h3 className="font-semibold">Resumen Ejecutivo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Totales, estadísticas y distribución
                </p>
              </div>
            </div>
            <Button
              onClick={exportSummaryToCSV}
              disabled={isExporting}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isExporting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Exportando...
                </>
              ) : (
                'Exportar Resumen'
              )}
            </Button>
          </div>

          {/* Export Commissions */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">💰</span>
              <div>
                <h3 className="font-semibold">Reporte de Comisiones</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comisiones por manicurista
                </p>
              </div>
            </div>
            <Button
              onClick={exportCommissionsToCSV}
              disabled={isExporting || payments.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isExporting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Exportando...
                </>
              ) : (
                'Exportar Comisiones'
              )}
            </Button>
          </div>
        </div>

        {/* Format Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>📝 Formato CSV:</strong> Los archivos se pueden abrir con
            Excel, Google Sheets o cualquier editor de hojas de cálculo.
            Incluyen codificación UTF-8 para caracteres especiales.
          </p>
        </div>

        {payments.length === 0 && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>⚠️ Sin datos:</strong> No hay pagos para exportar con los
              filtros aplicados. Ajusta los filtros para ver más resultados.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
