'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ItemActions } from '@/components/ui/ItemActions';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SpaAccountModal } from './SpaAccountModal';
import type { SpaAccountWithStats } from '@/types/spaAccounts';
import { ACCOUNT_TYPE_LABELS } from '@/types/expenses';
import { deleteSpaAccount, toggleSpaAccountStatus } from '../actions';

interface SpaAccountsManagerProps {
  spaAccounts: SpaAccountWithStats[];
  spaId: string;
  branches?: Array<{ id: string; name: string }>;
}

export function SpaAccountsManager({
  spaAccounts,
  spaId,
  branches = [],
}: SpaAccountsManagerProps) {
  const router = useRouter();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] =
    useState<SpaAccountWithStats | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [toggledAccountId, setToggledAccountId] = useState<string | null>(null);

  // Handle edit
  const handleEdit = (account: SpaAccountWithStats) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (account: SpaAccountWithStats) => {
    setSelectedAccount(account);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAccount) return;

    setIsDeleting(true);
    try {
      const result = await deleteSpaAccount(selectedAccount.id, spaId);

      if (result.success) {
        router.refresh();
        setIsDeleteDialogOpen(false);
        setSelectedAccount(null);
      } else {
        alert(result.error || 'Error al eliminar cuenta');
      }
    } catch {
      alert('Error inesperado al eliminar cuenta');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (account: SpaAccountWithStats) => {
    setIsToggling(true);
    setToggledAccountId(account.id);

    try {
      const result = await toggleSpaAccountStatus(account.id, spaId);

      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || 'Error al cambiar estado de la cuenta');
      }
    } catch {
      alert('Error inesperado al cambiar estado de la cuenta');
    } finally {
      setIsToggling(false);
      setToggledAccountId(null);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get icon for account type
  const getAccountTypeIcon = (
    type: 'BANK_ACCOUNT' | 'CASH' | 'DIGITAL_WALLET' | 'CREDIT_CARD'
  ) => {
    const icons = {
      BANK_ACCOUNT: '🏦',
      CASH: '💵',
      DIGITAL_WALLET: '📱',
      CREDIT_CARD: '💳',
    };
    return icons[type];
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Cuentas del Spa</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Gestiona las cuentas bancarias, cajas y billeteras digitales del
              negocio
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            + Nueva Cuenta
          </Button>
        </CardHeader>
        <CardContent>
          {spaAccounts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏦</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay cuentas configuradas
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Crea tu primera cuenta para gestionar el dinero del negocio
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Crear Primera Cuenta
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spaAccounts.map(account => (
                <div
                  key={account.id}
                  className={`p-4 border rounded-lg transition-all ${
                    account.isActive
                      ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 opacity-60'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getAccountTypeIcon(account.type)}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {account.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {ACCOUNT_TYPE_LABELS[account.type]}
                        </p>
                      </div>
                    </div>
                    <Badge variant={account.isActive ? 'success' : 'default'}>
                      {account.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>

                  {/* Description */}
                  {account.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {account.description}
                    </p>
                  )}

                  {/* Bank Info */}
                  {(account.bank || account.accountNumber) && (
                    <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                      {account.bank && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Banco:</span>{' '}
                          {account.bank}
                        </p>
                      )}
                      {account.accountNumber && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Cuenta:</span>{' '}
                          {account.accountNumber}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Branch */}
                  {account.branchId && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
                      📍{' '}
                      {branches.find(b => b.id === account.branchId)?.name ||
                        'Sede no encontrada'}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="space-y-2 mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Balance:
                      </span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                    {account.totalReceived !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Recibido:
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(account.totalReceived)}
                        </span>
                      </div>
                    )}
                    {account.totalPaid !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Pagado:
                        </span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(account.totalPaid)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">
                        Transacciones:
                      </span>
                      <span className="font-semibold">
                        {account._count.paymentsReceived +
                          account._count.expensePayments}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => handleToggleStatus(account)}
                      disabled={isToggling && toggledAccountId === account.id}
                      className={`flex-1 text-sm ${
                        account.isActive
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isToggling && toggledAccountId === account.id
                        ? '...'
                        : account.isActive
                          ? 'Desactivar'
                          : 'Activar'}
                    </Button>
                    <ItemActions
                      onEdit={() => handleEdit(account)}
                      onDelete={() => handleDelete(account)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <SpaAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        spaId={spaId}
        mode="create"
        branches={branches}
      />

      {/* Edit Modal */}
      <SpaAccountModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAccount(null);
        }}
        spaId={spaId}
        mode="edit"
        spaAccount={selectedAccount}
        branches={branches}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSelectedAccount(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Cuenta"
        description={
          selectedAccount
            ? `¿Estás seguro de que quieres eliminar la cuenta "${selectedAccount.name}"? ${
                selectedAccount._count.paymentsReceived +
                  selectedAccount._count.expensePayments >
                0
                  ? `Esta cuenta tiene ${selectedAccount._count.paymentsReceived + selectedAccount._count.expensePayments} transacción(es) registrada(s). No podrás eliminarla.`
                  : 'Esta acción no se puede deshacer.'
              }`
            : ''
        }
        confirmText={isDeleting ? 'Eliminando...' : 'Eliminar'}
        cancelText="Cancelar"
      />
    </>
  );
}
