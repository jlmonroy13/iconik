"use client"
import { useState } from 'react'
import { Button, useNotifications } from '@/components/ui'
import { Pencil, Trash, Plus, Clock } from 'lucide-react'
import { ScheduleModal } from './ScheduleModal'
import { addSpaSchedule, updateSpaSchedule, deleteSpaSchedule } from '../actions'
import type { ScheduleEntryFormValues } from '../schemas'

interface ScheduleListProps {
  schedules: Array<ScheduleEntryFormValues & { id: string }>
}

export function ScheduleList({ schedules }: ScheduleListProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingSchedule, setEditingSchedule] = useState<ScheduleEntryFormValues & { id?: string } | undefined>(undefined)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [localSchedules, setLocalSchedules] = useState(schedules)
  const { showSuccess, showError } = useNotifications()

  // Open modal for create
  const handleAdd = () => {
    setEditingSchedule(undefined)
    setModalMode('create')
    setModalOpen(true)
  }

  // Open modal for edit
  const handleEdit = (schedule: ScheduleEntryFormValues & { id: string }) => {
    setEditingSchedule(schedule)
    setModalMode('edit')
    setModalOpen(true)
  }

  // Add schedule
  const handleCreate = async (data: ScheduleEntryFormValues) => {
    setLoadingId('new')
    const res = await addSpaSchedule(data)
    if (res.success && res.data) {
      const normalized = {
        id: res.data.id,
        dayOfWeek: res.data.dayOfWeek ?? 0,
        isHoliday: res.data.isHoliday,
        isOpen: res.data.isOpen,
        startTime: res.data.startTime,
        endTime: res.data.endTime,
        description: res.data.description ?? undefined,
      }
      setLocalSchedules([...localSchedules, normalized])
      showSuccess('Horario agregado', 'El horario fue agregado correctamente.')
    } else {
      showError('Error', res.message || 'No se pudo agregar el horario.')
    }
    setLoadingId(null)
  }

  // Update schedule
  const handleUpdate = async (data: ScheduleEntryFormValues) => {
    if (!editingSchedule?.id) return
    setLoadingId(editingSchedule.id)
    const res = await updateSpaSchedule(editingSchedule.id, data)
    if (res.success && res.data) {
      const normalized = {
        id: res.data.id,
        dayOfWeek: res.data.dayOfWeek ?? 0,
        isHoliday: res.data.isHoliday,
        isOpen: res.data.isOpen,
        startTime: res.data.startTime,
        endTime: res.data.endTime,
        description: res.data.description ?? undefined,
      }
      setLocalSchedules(localSchedules.map(sch => sch.id === editingSchedule.id ? normalized : sch))
      showSuccess('Horario actualizado', 'El horario fue actualizado correctamente.')
    } else {
      showError('Error', res.message || 'No se pudo actualizar el horario.')
    }
    setLoadingId(null)
  }

  // Delete schedule
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este horario?')) return
    setLoadingId(id)
    const res = await deleteSpaSchedule(id)
    if (res.success) {
      setLocalSchedules(localSchedules.filter(sch => sch.id !== id))
      showSuccess('Horario eliminado', 'El horario fue eliminado correctamente.')
    } else {
      showError('Error', res.message || 'No se pudo eliminar el horario.')
    }
    setLoadingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center mb-2">
        <Button onClick={handleAdd} variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-1" /> Agregar horario
        </Button>
      </div>
      <div className="divide-y rounded-lg border overflow-hidden bg-white dark:bg-gray-900">
        {localSchedules.length === 0 && (
          <div className="p-4 text-center text-gray-500">No hay horarios configurados.</div>
        )}
        {localSchedules.map(sch => (
          <div key={sch.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <div className="flex-1 flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium">
                {sch.isHoliday ? 'Festivo' : ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][sch.dayOfWeek ?? 0]}
              </span>
              {sch.isOpen ? (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                  {sch.startTime} - {sch.endTime}
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                  Cerrado
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => handleEdit(sch)} disabled={loadingId === sch.id}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(sch.id)} disabled={loadingId === sch.id}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal para crear/editar */}
      <ScheduleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={modalMode === 'create' ? handleCreate : handleUpdate}
        initialData={modalMode === 'edit' ? editingSchedule : undefined}
        mode={modalMode}
        existingSchedules={localSchedules}
      />
    </div>
  )
}
