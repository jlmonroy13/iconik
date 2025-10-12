'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ItemActions } from '@/components/ui/ItemActions';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PaymentMethodModal } from './PaymentMethodModal';
import type { PaymentMethodWithStats } from '@/types/payments';
import { deletePaymentMethod, togglePaymentMethodStatus } from '../actions';

interface PaymentMethodsManagerProps {
  paymentMethods: PaymentMethodWithStats[];
  spaId: string;
}

export function PaymentMethodsManager({
  paymentMethods,
  spaId,
}: PaymentMethodsManagerProps) {
  const router = useRouter();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodWithStats | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [toggledMethodId, setToggledMethodId] = useState<string | null>(null);

  // Handle edit
  const handleEdit = (method: PaymentMethodWithStats) => {
    setSelectedMethod(method);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (method: PaymentMethodWithStats) => {
    setSelectedMethod(method);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMethod) return;

    setIsDeleting(true);
    try {
      const result = await deletePaymentMethod(selectedMethod.id, spaId);

      if (result.success) {
        router.refresh();
        setIsDeleteDialogOpen(false);
        setSelectedMethod(null);
      } else {
        alert(result.error || 'Error al eliminar método de pago');
      }
    } catch {
      alert('Error inesperado al eliminar método de pago');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (method: PaymentMethodWithStats) => {
    setIsToggling(true);
    setToggledMethodId(method.id);

    try {
      const result = await togglePaymentMethodStatus(method.id, spaId);

      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Error al cambiar estado del método de pago');
      }
    } catch {
      alert('Error inesperado al cambiar estado del método de pago');
    } finally {
      setIsToggling(false);
      setToggledMethodId(null);
    }
  };

  // Format transaction fee as percentage
  const formatFee = (fee: number) => {
    return `${(fee * 100).toFixed(2)}%`;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Métodos de Pago</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Gestiona los métodos de pago disponibles en tu spa
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            + Nuevo Método
          </Button>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay métodos de pago configurados
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Crea tu primer método de pago para empezar a registrar pagos
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Crear Primer Método
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg transition-all ${
                    method.isActive
                      ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-60'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {method.icon && (
                        <span className="text-2xl">{method.icon}</span>
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {method.name}
                        </h4>
                        {method.type && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {method.type}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={method.isActive ? 'success' : 'default'}>
                      {method.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Comisión:
                      </span>
                      <span className="font-semibold">
                        {formatFee(method.transactionFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Pagos registrados:
                      </span>
                      <span className="font-semibold">
                        {method._count.payments}
                      </span>
                    </div>
                    {method.totalAmount !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total recaudado:
                        </span>
                        <span className="font-semibold text-green-600">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                          }).format(method.totalAmount)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => handleToggleStatus(method)}
                      disabled={isToggling && toggledMethodId === method.id}
                      className={`flex-1 text-sm ${
                        method.isActive
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isToggling && toggledMethodId === method.id
                        ? '...'
                        : method.isActive
                          ? 'Desactivar'
                          : 'Activar'}
                    </Button>
                    <ItemActions
                      onEdit={() => handleEdit(method)}
                      onDelete={() => handleDelete(method)}
                      editLabel="Editar"
                      deleteLabel="Eliminar"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <PaymentMethodModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        spaId={spaId}
        mode="create"
      />

      {/* Edit Modal */}
      <PaymentMethodModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMethod(null);
        }}
        spaId={spaId}
        mode="edit"
        paymentMethod={selectedMethod}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedMethod(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Método de Pago"
        description={
          selectedMethod
            ? `¿Estás seguro de que quieres eliminar el método "${selectedMethod.name}"? ${
                selectedMethod._count.payments > 0
                  ? `Este método tiene ${selectedMethod._count.payments} pago(s) registrado(s). No podrás eliminarlo.`
                  : 'Esta acción no se puede deshacer.'
              }`
            : ''
        }
        confirmText={isDeleting ? 'Eliminando...' : 'Eliminar'}
        cancelText="Cancelar"
        isDestructive
      />
    </>
  );
}
