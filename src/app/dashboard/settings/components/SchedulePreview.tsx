'use client'

import { Calendar, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'

interface SchedulePreviewProps {
  schedules: Array<{
    id?: string
    dayOfWeek?: number | null
    isHoliday: boolean
    isOpen: boolean
    startTime: string
    endTime: string
    description?: string | null
  }>
}

const DAYS_OF_WEEK = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

export function SchedulePreview({ schedules }: SchedulePreviewProps) {
  const getDayLabel = (dayOfWeek: number | undefined | null, isHoliday: boolean) => {
    if (isHoliday) return 'Festivos'
    if (dayOfWeek === undefined || dayOfWeek === null) return 'Día específico'
    return DAYS_OF_WEEK[dayOfWeek]
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'pm' : 'am'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const sortedSchedules = [...schedules].sort((a, b) => {
    // Holidays first
    if (a.isHoliday && !b.isHoliday) return -1
    if (!a.isHoliday && b.isHoliday) return 1

    // Then by day of week
    const aDay = a.dayOfWeek ?? 0
    const bDay = b.dayOfWeek ?? 0
    return aDay - bDay
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Vista Previa de Horarios
        </h3>
      </div>

      <div className="grid gap-3">
        {sortedSchedules.map((schedule, index) => (
          <Card key={schedule.id || index} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getDayLabel(schedule.dayOfWeek, schedule.isHoliday)}
                    </span>
                  </div>

                  {schedule.isOpen ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Abierto
                      </span>
                      <span>
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </span>
                    </div>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      Cerrado
                    </span>
                  )}
                </div>

                {schedule.description && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {schedule.description}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Consejo:</strong> Los horarios configurados aquí se usarán para determinar la disponibilidad
          de citas y mostrarán a los clientes cuándo está abierto tu spa.
        </p>
      </div>
    </div>
  )
}
