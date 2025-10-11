'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import Switch from '@/components/ui/Switch';
import {
  createAvailabilitySchema,
  type CreateAvailabilityData,
} from '@/types/forms';
import {
  fetchManicuristById,
  createAvailabilityException,
  deleteAvailabilityException,
} from '../actions';
import type { ManicuristAvailability } from '@/generated/prisma';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface ManicuristAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  manicuristId: string;
  manicuristName: string;
  spaId: string;
  branchId: string;
}

export function ManicuristAvailabilityModal({
  isOpen,
  onClose,
  manicuristId,
  manicuristName,
  spaId,
  branchId,
}: ManicuristAvailabilityModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exceptions, setExceptions] = useState<ManicuristAvailability[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    date: Date;
  } | null>(null);

  const [allDay, setAllDay] = useState(true);

  const form = useForm<CreateAvailabilityData>({
    resolver: zodResolver(createAvailabilitySchema),
    defaultValues: {
      date: '',
      allDay: true,
      startTime: '',
      endTime: '',
      reason: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadExceptions();
      form.reset({
        date: '',
        allDay: true,
        startTime: '',
        endTime: '',
        reason: '',
      });
      setAllDay(true);
      setError(null);
    }
  }, [isOpen, manicuristId]);

  const loadExceptions = async () => {
    setLoading(true);
    setError(null);

    try {
      const manicurist = await fetchManicuristById(manicuristId);
      const sortedExceptions = (manicurist?.availability || []).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setExceptions(sortedExceptions);
    } catch (err) {
      setError('Error al cargar excepciones');
      console.error('Error loading exceptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CreateAvailabilityData) => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await createAvailabilityException(
        manicuristId,
        spaId,
        branchId,
        data
      );

      if (result.success) {
        router.refresh();
        await loadExceptions();
        form.reset({
          date: '',
          allDay: true,
          startTime: '',
          endTime: '',
          reason: '',
        });
        setAllDay(true);
      } else {
        setError(result.error || 'Error al crear excepción');
      }
    } catch (err) {
      setError('Error inesperado al guardar excepción');
      console.error('Error saving exception:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await deleteAvailabilityException(
        deleteConfirm.id,
        spaId,
        branchId
      );

      if (result.success) {
        router.refresh();
        await loadExceptions();
        setDeleteConfirm(null);
      } else {
        setError(result.error || 'Error al eliminar excepción');
      }
    } catch (err) {
      setError('Error inesperado al eliminar');
      console.error('Error deleting exception:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    // Convert 24h time to 12h format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTimeRangeText = (exception: ManicuristAvailability) => {
    if (exception.startTime && exception.endTime) {
      return `${formatTime(exception.startTime)} - ${formatTime(exception.endTime)}`;
    }
    return 'Todo el día';
  };

  const isPastDate = (date: Date) => {
    const checkDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const upcomingExceptions = exceptions.filter(e => !isPastDate(e.date));
  const pastExceptions = exceptions.filter(e => isPastDate(e.date));

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Excepciones de ${manicuristName}`}
        size="lg"
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Registra períodos específicos donde la manicurista NO estará
              disponible (vacaciones, días libres, etc.)
            </p>

            {/* Add New Exception Form */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
            >
              <h3 className="font-medium mb-4">Agregar Nueva Excepción</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">
                    Fecha <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    min={getTodayDate()}
                    {...form.register('date')}
                    disabled={submitting}
                    className="text-gray-900 dark:text-white font-medium [&::-webkit-datetime-edit-fields-wrapper]:text-gray-900 [&::-webkit-datetime-edit-fields-wrapper]:dark:text-white [&::-webkit-calendar-picker-indicator]:opacity-100"
                  />
                  {form.formState.errors.date && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.date.message}
                    </p>
                  )}
                </div>

                {/* All Day Toggle */}
                <div className="flex items-center justify-between border rounded-lg p-3 bg-white dark:bg-gray-700">
                  <div>
                    <Label htmlFor="allDay" className="font-medium">
                      No disponible todo el día
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Desactiva para especificar un rango de horas
                    </p>
                  </div>
                  <Switch
                    id="allDay"
                    checked={allDay}
                    onCheckedChange={(checked: boolean) => {
                      setAllDay(checked);
                      form.setValue('allDay', checked);
                      if (checked) {
                        form.setValue('startTime', '');
                        form.setValue('endTime', '');
                      }
                    }}
                    disabled={submitting}
                  />
                </div>

                {/* Time Range (only visible when not all day) */}
                {!allDay && (
                  <div className="grid grid-cols-2 gap-4 border rounded-lg p-3 bg-white dark:bg-gray-700">
                    <div>
                      <Label htmlFor="startTime">
                        Hora de inicio <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        {...form.register('startTime')}
                        disabled={submitting}
                        className="text-gray-900 dark:text-white font-medium [&::-webkit-datetime-edit-fields-wrapper]:text-gray-900 [&::-webkit-datetime-edit-fields-wrapper]:dark:text-white"
                      />
                      {form.formState.errors.startTime && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.startTime.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="endTime">
                        Hora de fin <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="endTime"
                        type="time"
                        {...form.register('endTime')}
                        disabled={submitting}
                        className="text-gray-900 dark:text-white font-medium [&::-webkit-datetime-edit-fields-wrapper]:text-gray-900 [&::-webkit-datetime-edit-fields-wrapper]:dark:text-white"
                      />
                      {form.formState.errors.endTime && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.endTime.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="reason">Motivo (opcional)</Label>
                  <Textarea
                    id="reason"
                    {...form.register('reason')}
                    placeholder="Ej: Vacaciones, Día personal, Cita médica..."
                    disabled={submitting}
                    rows={2}
                  />
                  {form.formState.errors.reason && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.reason.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {submitting ? 'Agregando...' : 'Agregar Excepción'}
                </Button>
              </div>
            </form>

            {/* Upcoming Exceptions */}
            {upcomingExceptions.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">
                  Próximas Excepciones ({upcomingExceptions.length})
                </h3>
                <div className="space-y-2">
                  {upcomingExceptions.map(exception => (
                    <div
                      key={exception.id}
                      className="border rounded-lg p-4 flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <div className="font-medium capitalize">
                          {formatDate(exception.date)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            🕒 {getTimeRangeText(exception)}
                          </span>
                        </div>
                        {exception.reason && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {exception.reason}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            id: exception.id,
                            date: exception.date,
                          })
                        }
                        disabled={submitting}
                        className="text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Exceptions */}
            {pastExceptions.length > 0 && (
              <div>
                <h3 className="font-medium mb-3 text-gray-500">
                  Excepciones Pasadas ({pastExceptions.length})
                </h3>
                <div className="space-y-2 opacity-60">
                  {pastExceptions.map(exception => (
                    <div
                      key={exception.id}
                      className="border rounded-lg p-4 flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <div className="font-medium capitalize">
                          {formatDate(exception.date)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            🕒 {getTimeRangeText(exception)}
                          </span>
                        </div>
                        {exception.reason && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {exception.reason}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            id: exception.id,
                            date: exception.date,
                          })
                        }
                        disabled={submitting}
                        className="text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {exceptions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay excepciones registradas
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm?.open || false}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Eliminar Excepción"
        description={`¿Estás seguro de eliminar la excepción del ${deleteConfirm ? formatDate(deleteConfirm.date) : ''}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={submitting}
      />
    </>
  );
}
