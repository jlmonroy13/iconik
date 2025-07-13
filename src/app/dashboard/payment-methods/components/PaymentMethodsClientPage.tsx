"use client"
import { useState, useEffect } from 'react'
import { DashboardSectionLayout } from '../../components/DashboardSectionLayout'
import { CreditCard, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PaymentMethodStats, PaymentMethodList } from './index'
import { PaymentMethodModal } from './PaymentMethodModal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { PaymentMethod } from '../types'
import { PaymentMethodFormData } from './PaymentMethodForm'
import { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod } from '../actions'
import { useNotifications } from '@/components/ui/NotificationContext'

function getStats(methods: PaymentMethod[]) {
  const total = methods.length
  const active = methods.filter(m => m.isActive).length
  const inactive = total - active
  // TODO: Reemplazar pagos y monto total por datos reales si se requiere
  return {
    total,
    active,
    inactive,
    totalPayments: 0,
    totalAmount: 0,
    byMethod: []
  }
}

function normalizeMethod(method: unknown): PaymentMethod {
  const m = method as PaymentMethod
  return {
    ...m,
    type: m.type ?? '',
    icon: m.icon ?? '',
  }
}

export default function PaymentMethodsClientPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const { showSuccess, showError } = useNotifications()

  // Cargar métodos de pago al montar
  useEffect(() => {
    async function fetchMethods() {
      setLoading(true)
      setError(null)
      const res = await getPaymentMethods()
      if (res.success && res.data) {
        setMethods(res.data.map(normalizeMethod))
      } else {
        setError(res.message || 'Error al cargar los métodos de pago')
      }
      setLoading(false)
    }
    fetchMethods()
  }, [])

  // Crear
  const handleCreate = async (data: PaymentMethodFormData) => {
    setIsSubmitting(true)
    const res = await createPaymentMethod(data)
    if (res.success && res.data) {
      setMethods(prev => [normalizeMethod(res.data), ...prev])
      showSuccess('Método de pago creado', 'El método de pago ha sido creado exitosamente.')
      setCreateModalOpen(false)
    } else {
      showError('Error al crear', res.message || 'No se pudo crear el método de pago.')
    }
    setIsSubmitting(false)
  }

  // Editar
  const handleEdit = async (data: PaymentMethodFormData) => {
    if (!selectedMethod) return
    setIsSubmitting(true)
    const res = await updatePaymentMethod(selectedMethod.id, data)
    if (res.success && res.data) {
      setMethods(prev => prev.map(m => m.id === selectedMethod.id ? normalizeMethod(res.data) : m))
      showSuccess('Método de pago actualizado', 'Los datos han sido actualizados exitosamente.')
      setEditModalOpen(false)
      setSelectedMethod(undefined)
    } else {
      showError('Error al actualizar', res.message || 'No se pudo actualizar el método de pago.')
    }
    setIsSubmitting(false)
  }

  // Eliminar
  const handleDeleteConfirmed = async () => {
    if (!selectedMethod) return
    setIsDeleteLoading(true)
    const res = await deletePaymentMethod(selectedMethod.id)
    if (res.success) {
      setMethods(prev => prev.filter(m => m.id !== selectedMethod.id))
      showSuccess('Método de pago eliminado', 'El método de pago ha sido eliminado.')
      setDeleteModalOpen(false)
      setSelectedMethod(undefined)
    } else {
      showError('Error al eliminar', res.message || 'No se pudo eliminar el método de pago.')
    }
    setIsDeleteLoading(false)
  }

  // Abrir modales
  const openCreateModal = () => {
    setCreateModalOpen(true)
    setSelectedMethod(undefined)
  }
  const openEditModal = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setEditModalOpen(true)
  }
  const openDeleteModal = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setSelectedMethod(undefined)
  }

  return (
    <DashboardSectionLayout
      icon={<CreditCard className="w-8 h-8 text-green-600" />}
      title="Métodos de Pago"
      description="Administra los métodos de pago disponibles para tu spa."
      actionButton={
        <Button onClick={openCreateModal} variant="primary" className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo Método
        </Button>
      }
    >
      {loading ? (
        <div className="py-12 text-center text-gray-500">Cargando métodos de pago...</div>
      ) : error ? (
        <div className="py-12 text-center text-red-500">{error}</div>
      ) : (
        <>
          <PaymentMethodStats stats={getStats(methods)} />
          <div className="mt-6">
            <PaymentMethodList
              methods={methods}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          </div>
        </>
      )}
      <PaymentMethodModal
        isOpen={editModalOpen || createModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setCreateModalOpen(false)
          setSelectedMethod(undefined)
        }}
        onSubmit={editModalOpen ? handleEdit : handleCreate}
        method={editModalOpen ? selectedMethod : undefined}
        isSubmitting={isSubmitting}
      />
      <ConfirmDialog
        open={deleteModalOpen}
        title="Eliminar método de pago"
        description={selectedMethod ? `¿Estás seguro de que deseas eliminar '${selectedMethod.name}'? Esta acción no se puede deshacer.` : ''}
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteConfirmed}
        isLoading={isDeleteLoading}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </DashboardSectionLayout>
  )
}
