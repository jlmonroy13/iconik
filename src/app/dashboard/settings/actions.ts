'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/../../auth'
import { redirect } from 'next/navigation'
import {
  SpaSettingsSchema,
  OperatingHoursSchema,
  // NotificationSettingsSchema,
  // GeneralPreferencesSchema,
  type SpaSettingsFormValues,
  type OperatingHoursFormValues,
  // type NotificationSettingsFormValues,
  // type GeneralPreferencesFormValues
} from './schemas'

// Helper function to get spa ID from session
async function getSpaId() {
  const session = await auth()
  if (!session?.user?.spaId) {
    redirect('/onboarding')
  }
  return session.user.spaId
}

export async function updateSpaSettings(data: SpaSettingsFormValues) {
  try {
    const spaId = await getSpaId()
    const validatedData = SpaSettingsSchema.parse(data)

    const updatedSpa = await prisma.spa.update({
      where: { id: spaId },
      data: validatedData,
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
      data: updatedSpa,
    }
  } catch (error) {
    console.error('Error updating spa settings:', error)
    return {
      success: false,
      message: 'No se pudo actualizar la configuración del spa. Inténtalo de nuevo.',
    }
  }
}

export async function updateOperatingHours(data: OperatingHoursFormValues) {
  try {
    const spaId = await getSpaId()
    const validatedData = OperatingHoursSchema.parse(data)

    // First, delete existing schedules
    await prisma.spaSchedule.deleteMany({
      where: { spaId },
    })

    // Then create new schedules
    const schedules = await Promise.all(
      validatedData.schedules.map(schedule =>
        prisma.spaSchedule.create({
          data: {
            spaId,
            dayOfWeek: schedule.dayOfWeek,
            isHoliday: schedule.isHoliday,
            isOpen: schedule.isOpen,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            description: schedule.description,
          },
        })
      )
    )

    // Update legacy fields for backward compatibility
    const firstOpenSchedule = validatedData.schedules.find(s => s.isOpen)
    if (firstOpenSchedule) {
      await prisma.spa.update({
        where: { id: spaId },
        data: {
          openingTime: firstOpenSchedule.startTime,
          closingTime: firstOpenSchedule.endTime,
        },
      })
    }

    revalidatePath('/dashboard/settings')

    return {
      success: true,
      data: schedules,
    }
  } catch (error) {
    console.error('Error updating operating hours:', error)
    return {
      success: false,
      message: 'No se pudo actualizar los horarios de operación. Inténtalo de nuevo.',
    }
  }
}

export async function updateNotificationSettings(/* data: NotificationSettingsFormValues */) {
  try {
    const spaId = await getSpaId()
    // const validatedData = NotificationSettingsSchema.parse(data)

    // For now, we'll store notification settings in a JSON field
    // In the future, you might want to create a separate table for this
    const updatedSpa = await prisma.spa.update({
      where: { id: spaId },
      data: {
        // We'll need to add a JSON field to the Spa model for this
        // For now, we'll use a placeholder
      },
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
      data: updatedSpa,
    }
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return {
      success: false,
      message: 'No se pudo actualizar la configuración de notificaciones. Inténtalo de nuevo.',
    }
  }
}

export async function updateGeneralPreferences(/* data: GeneralPreferencesFormValues */) {
  try {
    const spaId = await getSpaId()
    // const validatedData = GeneralPreferencesSchema.parse(data)

    // For now, we'll store preferences in a JSON field
    // In the future, you might want to create a separate table for this
    const updatedSpa = await prisma.spa.update({
      where: { id: spaId },
      data: {
        // We'll need to add a JSON field to the Spa model for this
        // For now, we'll use a placeholder
      },
    })

    revalidatePath('/dashboard/settings')

    return {
      success: true,
      data: updatedSpa,
    }
  } catch (error) {
    console.error('Error updating general preferences:', error)
    return {
      success: false,
      message: 'No se pudo actualizar las preferencias generales. Inténtalo de nuevo.',
    }
  }
}

// Initialize default schedules for a spa
export async function initializeDefaultSchedules(spaId: string) {
  try {
    const existingSchedules = await prisma.spaSchedule.findMany({
      where: { spaId },
    })

    if (existingSchedules.length === 0) {
      const defaultSchedules = [
        { dayOfWeek: 1, isHoliday: false, isOpen: true, startTime: '08:30', endTime: '19:00', description: 'Lunes' },
        { dayOfWeek: 2, isHoliday: false, isOpen: true, startTime: '08:30', endTime: '19:00', description: 'Martes' },
        { dayOfWeek: 3, isHoliday: false, isOpen: true, startTime: '08:30', endTime: '19:00', description: 'Miércoles' },
        { dayOfWeek: 4, isHoliday: false, isOpen: true, startTime: '08:30', endTime: '19:00', description: 'Jueves' },
        { dayOfWeek: 5, isHoliday: false, isOpen: true, startTime: '08:30', endTime: '19:00', description: 'Viernes' },
        { dayOfWeek: 6, isHoliday: false, isOpen: true, startTime: '08:30', endTime: '19:00', description: 'Sábado' },
        { dayOfWeek: 0, isHoliday: false, isOpen: false, startTime: '09:00', endTime: '16:00', description: 'Domingo - No laboramos' },
        { dayOfWeek: null, isHoliday: true, isOpen: true, startTime: '09:00', endTime: '16:00', description: 'Festivos' },
      ]

      await Promise.all(
        defaultSchedules.map(schedule =>
          prisma.spaSchedule.create({
            data: {
              spaId,
              dayOfWeek: schedule.dayOfWeek,
              isHoliday: schedule.isHoliday,
              isOpen: schedule.isOpen,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              description: schedule.description,
            },
          })
        )
      )
    }
  } catch (error) {
    console.error('Error initializing default schedules:', error)
  }
}

// Get all settings for the spa
export async function getSpaSettings() {
  try {
    const spaId = await getSpaId()

    // Initialize default schedules if none exist
    await initializeDefaultSchedules(spaId)

    const spa = await prisma.spa.findUnique({
      where: { id: spaId },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        phone: true,
        email: true,
        logoUrl: true,
        openingTime: true,
        closingTime: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        spaSchedules: {
          select: {
            id: true,
            dayOfWeek: true,
            isHoliday: true,
            isOpen: true,
            startTime: true,
            endTime: true,
            description: true,
            specificDate: true,
          },
          orderBy: [
            { isHoliday: 'asc' },
            { dayOfWeek: 'asc' },
          ],
        },
      },
    })

    if (!spa) {
      return {
        success: false,
        message: 'No se encontró la información del spa.',
      }
    }

    return {
      success: true,
      data: spa,
    }
  } catch (error) {
    console.error('Error getting spa settings:', error)
    return {
      success: false,
      message: 'No se pudo cargar la configuración del spa. Inténtalo de nuevo.',
    }
  }
}

// Types for schedule input
export interface SpaScheduleInput {
  dayOfWeek?: number | null
  isHoliday: boolean
  isOpen: boolean
  startTime: string
  endTime: string
  description?: string | null
  specificDate?: Date | null
}

export async function addSpaSchedule(data: SpaScheduleInput) {
  try {
    const spaId = await getSpaId()
    const schedule = await prisma.spaSchedule.create({
      data: {
        ...data,
        spaId,
      },
    })
    revalidatePath('/dashboard/settings')
    return { success: true, data: schedule }
  } catch (error) {
    console.error('Error adding schedule:', error)
    return { success: false, message: 'No se pudo agregar el horario.' }
  }
}

export async function updateSpaSchedule(id: string, data: Partial<SpaScheduleInput>) {
  try {
    const spaId = await getSpaId()
    const schedule = await prisma.spaSchedule.update({
      where: { id, spaId },
      data,
    })
    revalidatePath('/dashboard/settings')
    return { success: true, data: schedule }
  } catch (error) {
    console.error('Error updating schedule:', error)
    return { success: false, message: 'No se pudo actualizar el horario.' }
  }
}

export async function deleteSpaSchedule(id: string) {
  try {
    const spaId = await getSpaId()

    await prisma.spaSchedule.delete({
      where: {
        id,
        spaId, // Ensure the schedule belongs to the current spa
      },
    })

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error) {
    console.error('Error deleting spa schedule:', error)
    return {
      success: false,
      message: 'No se pudo eliminar el horario. Inténtalo de nuevo.',
    }
  }
}

// Sales Goals Actions
export async function getSalesGoals() {
  try {
    const spaId = await getSpaId()

    const goals = await prisma.salesGoal.findMany({
      where: { spaId },
      include: {
        manicurist: {
          select: { name: true }
        },
        service: {
          select: { name: true }
        },
        progress: {
          orderBy: { date: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return {
      success: true,
      data: goals
    }
  } catch (error) {
    console.error('Error fetching sales goals:', error)
    return {
      success: false,
      message: 'No se pudieron cargar las metas de ventas.',
    }
  }
}

export async function createSalesGoal(data: {
  name: string
  type: 'REVENUE' | 'SERVICES' | 'CLIENTS' | 'APPOINTMENTS'
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  targetAmount: number
  startDate: string
  endDate?: string
  isActive?: boolean
  manicuristId?: string
  serviceId?: string
}) {
  try {
    const spaId = await getSpaId()

    const goal = await prisma.salesGoal.create({
      data: {
        spaId,
        name: data.name,
        type: data.type,
        period: data.period,
        targetAmount: data.targetAmount,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isActive: data.isActive ?? true,
        manicuristId: data.manicuristId || null,
        serviceId: data.serviceId || null,
      },
      include: {
        manicurist: {
          select: { name: true }
        },
        service: {
          select: { name: true }
        }
      }
    })

    revalidatePath('/dashboard/settings')
    return {
      success: true,
      data: goal
    }
  } catch (error) {
    console.error('Error creating sales goal:', error)
    return {
      success: false,
      message: 'No se pudo crear la meta de ventas. Inténtalo de nuevo.',
    }
  }
}

export async function updateSalesGoal(id: string, data: {
  name?: string
  type?: 'REVENUE' | 'SERVICES' | 'CLIENTS' | 'APPOINTMENTS'
  period?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  targetAmount?: number
  startDate?: string
  endDate?: string
  isActive?: boolean
  manicuristId?: string
  serviceId?: string
}) {
  try {
    const spaId = await getSpaId()

    const updateData: {
      name?: string
      type?: 'REVENUE' | 'SERVICES' | 'CLIENTS' | 'APPOINTMENTS'
      period?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
      targetAmount?: number
      startDate?: Date
      endDate?: Date | null
      isActive?: boolean
      manicuristId?: string | null
      serviceId?: string | null
    } = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.type !== undefined) updateData.type = data.type
    if (data.period !== undefined) updateData.period = data.period
    if (data.targetAmount !== undefined) updateData.targetAmount = data.targetAmount
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate)
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.manicuristId !== undefined) updateData.manicuristId = data.manicuristId || null
    if (data.serviceId !== undefined) updateData.serviceId = data.serviceId || null

    const goal = await prisma.salesGoal.update({
      where: {
        id,
        spaId, // Ensure the goal belongs to the current spa
      },
      data: updateData,
      include: {
        manicurist: {
          select: { name: true }
        },
        service: {
          select: { name: true }
        }
      }
    })

    revalidatePath('/dashboard/settings')
    return {
      success: true,
      data: goal
    }
  } catch (error) {
    console.error('Error updating sales goal:', error)
    return {
      success: false,
      message: 'No se pudo actualizar la meta de ventas. Inténtalo de nuevo.',
    }
  }
}

export async function deleteSalesGoal(id: string) {
  try {
    const spaId = await getSpaId()

    await prisma.salesGoal.delete({
      where: {
        id,
        spaId, // Ensure the goal belongs to the current spa
      },
    })

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error) {
    console.error('Error deleting sales goal:', error)
    return {
      success: false,
      message: 'No se pudo eliminar la meta de ventas. Inténtalo de nuevo.',
    }
  }
}
