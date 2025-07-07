'use client'

import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button, Input, Textarea } from '@/components/ui'
import { Plus, Trash2, Calendar, Clock } from 'lucide-react'
import type { ManicuristAvailabilityData } from '../schemas'

export function ManicuristAvailabilityForm() {
  const { control, watch, setValue, formState: { errors } } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'availability',
  })

  const availability = watch('availability') || []

  const addAvailability = () => {
    append({
      date: new Date(),
      startTime: '',
      endTime: '',
      isAvailable: true,
      reason: '',
    })
  }

  const updateAvailabilityField = (index: number, field: keyof ManicuristAvailabilityData, value: string | Date | boolean) => {
    const updatedAvailability = [...availability]
    updatedAvailability[index] = { ...updatedAvailability[index], [field]: value }
    setValue('availability', updatedAvailability)
  }

  const getFieldError = (index: number, field: keyof ManicuristAvailabilityData): string | undefined => {
    const fieldErrors = errors.availability as { [key: number]: { [key: string]: { message?: string } } } | undefined
    return fieldErrors?.[index]?.[field]?.message
  }

  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return ''
    if (typeof date === 'string') {
      return date
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
    return ''
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Disponibilidad especial
          </h3>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAvailability}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar fecha
        </Button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Configura días específicos como vacaciones, días libres, o horarios
        especiales
      </p>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No hay fechas especiales configuradas</p>
          <p className="text-sm">
            Agrega vacaciones, días libres o horarios especiales
          </p>
        </div>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const currentAvailability = availability[index];

          return (
            <div
              key={field.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Fecha especial #{index + 1}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-end">
                <Input
                  label="Fecha"
                  type="date"
                  value={
                    currentAvailability?.date
                      ? formatDate(currentAvailability.date)
                      : ""
                  }
                  onChange={(e) => {
                    updateAvailabilityField(
                      index,
                      "date",
                      new Date(e.target.value)
                    );
                  }}
                  error={getFieldError(index, "date")}
                />

                <div className="flex items-center gap-2 mb-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentAvailability?.isAvailable ?? true}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const updated = { ...availability[index], isAvailable: checked };
                        if (!checked) {
                          updated.startTime = "";
                          updated.endTime = "";
                        }
                        const updatedAvailability = [...availability];
                        updatedAvailability[index] = updated;
                        setValue('availability', updatedAvailability);
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Disponible
                    </span>
                  </label>
                </div>
              </div>

              {currentAvailability?.isAvailable && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Hora de inicio (opcional)"
                    type="time"
                    value={currentAvailability?.startTime || ""}
                    onChange={(e) => {
                      updateAvailabilityField(
                        index,
                        "startTime",
                        e.target.value
                      );
                    }}
                    error={getFieldError(index, "startTime")}
                    placeholder="Dejar vacío para usar horario regular"
                  />

                  <Input
                    label="Hora de fin (opcional)"
                    type="time"
                    value={currentAvailability?.endTime || ""}
                    onChange={(e) => {
                      updateAvailabilityField(index, "endTime", e.target.value);
                    }}
                    error={getFieldError(index, "endTime")}
                    placeholder="Dejar vacío para usar horario regular"
                  />
                </div>
              )}

              <Textarea
                label="Motivo (opcional)"
                placeholder="Ej: Vacaciones, Día libre, Horario especial..."
                value={currentAvailability?.reason || ""}
                onChange={(e) => {
                  updateAvailabilityField(index, "reason", e.target.value);
                }}
                error={getFieldError(index, "reason")}
                rows={2}
              />

              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>
                    {currentAvailability?.isAvailable
                      ? "Disponible"
                      : "No disponible"}
                    {currentAvailability?.startTime &&
                    currentAvailability?.endTime
                      ? ` de ${currentAvailability.startTime} a ${currentAvailability.endTime}`
                      : currentAvailability?.isAvailable
                      ? " (horario regular)"
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {errors.availability && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {errors.availability.message as string}
        </p>
      )}
    </div>
  );
}
