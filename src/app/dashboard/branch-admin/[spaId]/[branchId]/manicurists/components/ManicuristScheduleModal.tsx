'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui';
import { Spinner } from '@/components/ui/Spinner';
import { updateScheduleSchema, type UpdateScheduleData } from '@/types/forms';
import { fetchManicuristById, updateManicuristSchedule } from '../actions';

interface ManicuristScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  manicuristId: string;
  manicuristName: string;
  spaId: string;
  branchId: string;
}

const DAY_LABELS: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

const DAYS_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday-Sunday

const DEFAULT_SCHEDULE = DAYS_ORDER.map(day => ({
  dayOfWeek: day,
  startTime: '09:00',
  endTime: '18:00',
  isActive: day !== 0, // Sunday inactive by default
}));

export function ManicuristScheduleModal({
  isOpen,
  onClose,
  manicuristId,
  manicuristName,
  spaId,
  branchId,
}: ManicuristScheduleModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateScheduleData>({
    resolver: zodResolver(updateScheduleSchema),
    defaultValues: {
      schedules: DEFAULT_SCHEDULE,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'schedules',
  });

  useEffect(() => {
    if (isOpen) {
      loadSchedule();
    }
  }, [isOpen, manicuristId]);

  const loadSchedule = async () => {
    setLoading(true);
    setError(null);

    try {
      const manicurist = await fetchManicuristById(manicuristId);

      if (manicurist?.schedules && manicurist.schedules.length > 0) {
        // Sort schedules by day order
        const sortedSchedules = manicurist.schedules
          .map(s => ({
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            isActive: s.isActive,
          }))
          .sort(
            (a, b) =>
              DAYS_ORDER.indexOf(a.dayOfWeek) - DAYS_ORDER.indexOf(b.dayOfWeek)
          );

        form.reset({ schedules: sortedSchedules });
      } else {
        form.reset({ schedules: DEFAULT_SCHEDULE });
      }
    } catch (err) {
      setError('Error al cargar horarios');
      console.error('Error loading schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UpdateScheduleData) => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await updateManicuristSchedule(
        manicuristId,
        spaId,
        branchId,
        data
      );

      if (result.success) {
        router.refresh();
        onClose();
      } else {
        setError(result.error || 'Error al actualizar horario');
      }
    } catch (err) {
      setError('Error inesperado al guardar horario');
      console.error('Error saving schedule:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyToAll = (index: number) => {
    const sourceSchedule = form.getValues(`schedules.${index}`);
    const schedules = form.getValues('schedules');
    const newSchedules = schedules.map(s => ({
      ...s,
      startTime: sourceSchedule.startTime,
      endTime: sourceSchedule.endTime,
      isActive: sourceSchedule.isActive,
    }));
    form.setValue('schedules', newSchedules);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Horario de ${manicuristName}`}
      size="lg"
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Define el horario semanal de trabajo:
          </p>

          {/* Schedule Items */}
          <div className="space-y-4">
            {fields.map((field, index) => {
              const dayOfWeek = field.dayOfWeek;
              const isActive = form.watch(`schedules.${index}.isActive`);

              return (
                <div
                  key={field.id}
                  className={`border rounded-lg p-4 ${
                    isActive
                      ? 'bg-white dark:bg-gray-800'
                      : 'bg-gray-50 dark:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-medium">
                      {DAY_LABELS[dayOfWeek]}
                    </Label>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyToAll(index)}
                        disabled={submitting}
                      >
                        Copiar a todos
                      </Button>
                      <Controller
                        name={`schedules.${index}.isActive`}
                        control={form.control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={submitting}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {isActive && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`start-${index}`} className="text-sm">
                          Hora Inicio
                        </Label>
                        <Input
                          id={`start-${index}`}
                          type="time"
                          {...form.register(`schedules.${index}.startTime`)}
                          disabled={submitting}
                          className="text-gray-900 dark:text-white font-medium [&::-webkit-datetime-edit-fields-wrapper]:text-gray-900 [&::-webkit-datetime-edit-fields-wrapper]:dark:text-white"
                        />
                        {form.formState.errors.schedules?.[index]
                          ?.startTime && (
                          <p className="text-xs text-red-500 mt-1">
                            {
                              form.formState.errors.schedules[index]?.startTime
                                ?.message
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`end-${index}`} className="text-sm">
                          Hora Fin
                        </Label>
                        <Input
                          id={`end-${index}`}
                          type="time"
                          {...form.register(`schedules.${index}.endTime`)}
                          disabled={submitting}
                          className="text-gray-900 dark:text-white font-medium [&::-webkit-datetime-edit-fields-wrapper]:text-gray-900 [&::-webkit-datetime-edit-fields-wrapper]:dark:text-white"
                        />
                        {form.formState.errors.schedules?.[index]?.endTime && (
                          <p className="text-xs text-red-500 mt-1">
                            {
                              form.formState.errors.schedules[index]?.endTime
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? 'Guardando...' : 'Guardar Horario'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
