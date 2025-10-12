'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import type { PaymentWithDetails } from '@/types/payments';
import { fetchPaymentById, markCommissionAsPaid } from '../actions';

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string | null;
  spaId: string;
  branchId: string;
}

export function PaymentDetailModal({
  isOpen,
  onClose,
  paymentId,
  spaId,
  branchId,
}: PaymentDetailModalProps) {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPaymentDetails = useCallback(async () => {
    if (!paymentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchPaymentById(paymentId);

      if (result.success && result.data) {
        setPayment(result.data);
      } else {
        setError(result.error || 'Error al cargar los detalles del pago');
      }
    } catch {
      setError('Error inesperado al cargar los detalles del pago');
    } finally {
      setIsLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    if (isOpen && paymentId) {
      loadPaymentDetails();
    } else {
      // Reset state when modal closes
      setPayment(null);
      setError(null);
    }
  }, [isOpen, paymentId, loadPaymentDetails]);

  const handleMarkCommissionAsPaid = async () => {
    if (!payment?.commission) return;

    setIsMarkingPaid(true);
    try {
      const result = await markCommissionAsPaid(
        payment.commission.id,
        spaId,
        branchId
      );

      if (result.success) {
        // Reload payment details to get updated status
        await loadPaymentDetails();
        router.refresh();
      } else {
        alert(result.error || 'Error al marcar comisión como pagada');
      }
    } catch {
      alert('Error inesperado al marcar comisión como pagada');
    } finally {
      setIsMarkingPaid(false);
    }
  };

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
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Pago"
      size="large"
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Error al cargar el pago
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
            <Button onClick={loadPaymentDetails} className="mt-4">
              Reintentar
            </Button>
          </div>
        ) : payment ? (
          <>
            {/* Payment Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID de Pago
                  </p>
                  <p className="font-mono text-sm">{payment.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fecha de Pago
                  </p>
                  <p className="font-medium">{formatDate(payment.paidAt)}</p>
                </div>
                {payment.reference && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Referencia
                    </p>
                    <p className="font-mono text-sm">{payment.reference}</p>
                  </div>
                )}
                {payment.branch && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sede
                    </p>
                    <p className="font-medium">{payment.branch.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Client Information */}
            {payment.appointment?.client && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nombre
                    </p>
                    <p className="font-medium">
                      {payment.appointment.client.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Documento
                    </p>
                    <p className="font-medium">
                      {payment.appointment.client.documentType}{' '}
                      {payment.appointment.client.documentNumber}
                    </p>
                  </div>
                  {payment.appointment.client.phone && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Teléfono
                      </p>
                      <p className="font-medium">
                        {payment.appointment.client.phone}
                      </p>
                    </div>
                  )}
                  {payment.appointment.client.email && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Email
                      </p>
                      <p className="font-medium">
                        {payment.appointment.client.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Services */}
            {payment.appointment?.services &&
              payment.appointment.services.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Servicios Pagados
                  </h3>
                  <div className="space-y-3">
                    {payment.appointment.services.map(appointmentService => (
                      <div
                        key={appointmentService.id}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {appointmentService.service.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Manicurista: {appointmentService.manicurist.name}
                          </p>
                        </div>
                        <p className="font-semibold">
                          {formatCurrency(appointmentService.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Single Service (if payment is for a single service) */}
            {payment.appointmentService && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Servicio Pagado</h3>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {payment.appointmentService.service.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manicurista: {payment.appointmentService.manicurist.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Método de Pago</h3>
              <div className="flex items-center gap-3">
                {payment.paymentMethod.icon && (
                  <span className="text-2xl">{payment.paymentMethod.icon}</span>
                )}
                <div>
                  <p className="font-medium">{payment.paymentMethod.name}</p>
                  {payment.paymentMethod.type && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.paymentMethod.type}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Desglose de Montos</h3>
              <div className="space-y-3">
                {/* Original Amount */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Monto Original
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(payment.originalAmount)}
                  </span>
                </div>

                {/* Discount */}
                {payment.discountAmount > 0 && (
                  <>
                    <div className="flex justify-between items-center text-red-600">
                      <span>
                        Descuento
                        {payment.discountReason && (
                          <span className="text-xs ml-1">
                            ({payment.discountReason})
                          </span>
                        )}
                      </span>
                      <span className="font-semibold">
                        -{formatCurrency(payment.discountAmount)}
                      </span>
                    </div>
                    {payment.discountAffectsCommission && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                        * Este descuento afecta la comisión de la manicurista
                      </p>
                    )}
                  </>
                )}

                {/* Transaction Fee */}
                {payment.transactionFeeAmount > 0 && (
                  <div className="flex justify-between items-center text-orange-600">
                    <span>
                      Comisión de Transacción (
                      {payment.transactionFeeRate * 100}%)
                    </span>
                    <span className="font-semibold">
                      -{formatCurrency(payment.transactionFeeAmount)}
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-300 dark:border-gray-600 my-2" />

                {/* Final Amount */}
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Monto Final</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Commission Information */}
            {payment.commission && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Comisión Generada</h3>
                  {getCommissionStatusBadge(payment.commission.status)}
                </div>
                <div className="space-y-3">
                  {/* Manicurist */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Manicurista
                    </span>
                    <span className="font-medium">
                      {payment.commission.manicurist.name}
                    </span>
                  </div>

                  {/* Service Amount */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Monto del Servicio
                    </span>
                    <span className="font-medium">
                      {formatCurrency(payment.commission.serviceAmount)}
                    </span>
                  </div>

                  {/* Commission Rate */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tasa de Comisión
                    </span>
                    <span className="font-medium">
                      {(payment.commission.commissionRate * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Original Commission */}
                  {payment.commission.discountAmount > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          Comisión Original
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            payment.commission.originalCommissionAmount
                          )}
                        </span>
                      </div>

                      {/* Discount Impact */}
                      <div className="flex justify-between items-center text-red-600">
                        <span>Impacto del Descuento</span>
                        <span className="font-medium">
                          -{formatCurrency(payment.commission.discountAmount)}
                        </span>
                      </div>
                    </>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-300 dark:border-gray-600 my-2" />

                  {/* Final Commission */}
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Comisión Final</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(payment.commission.commissionAmount)}
                    </span>
                  </div>

                  {/* Spa Amount */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Monto para el Spa
                    </span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(payment.commission.spaAmount)}
                    </span>
                  </div>
                </div>

                {/* Mark as Paid Button */}
                {payment.commission.status === 'PENDING' && (
                  <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                    <Button
                      onClick={handleMarkCommissionAsPaid}
                      disabled={isMarkingPaid}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isMarkingPaid ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Marcando como Pagada...
                        </>
                      ) : (
                        '✅ Marcar Comisión como Pagada'
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Cash Register Transaction */}
            {payment.cashRegisterTransaction && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Transacción de Caja
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tipo de Transacción
                    </p>
                    <p className="font-medium">
                      {payment.cashRegisterTransaction.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Monto
                    </p>
                    <p className="font-medium">
                      {formatCurrency(payment.cashRegisterTransaction.amount)}
                    </p>
                  </div>
                  {payment.cashRegisterTransaction.cashIn > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Efectivo Recibido
                      </p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(payment.cashRegisterTransaction.cashIn)}
                      </p>
                    </div>
                  )}
                  {payment.cashRegisterTransaction.cashOut > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Efectivo Entregado
                      </p>
                      <p className="font-medium text-red-600">
                        {formatCurrency(
                          payment.cashRegisterTransaction.cashOut
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Cerrar
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
