'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/../../auth'
import { redirect } from 'next/navigation'

// Helper function to get spa ID from session
async function getSpaId() {
  const session = await auth()
  if (!session?.user?.spaId) {
    redirect('/onboarding')
  }
  return session.user.spaId
}

export async function getAppointments() {
  try {
    const spaId = await getSpaId()
    const appointments = await prisma.appointment.findMany({
      where: { spaId },
      include: {
        client: true,
        manicurist: true,
        services: {
          include: {
            service: true,
            manicurist: true,
            payments: { include: { paymentMethod: true } },
            feedback: true
          }
        },
        payments: { include: { paymentMethod: true } }
      },
      orderBy: { scheduledAt: 'asc' }
    })
    return {
      success: true,
      data: appointments,
    }
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return {
      success: false,
      message: 'No se pudieron cargar las citas. Inténtalo de nuevo.',
    }
  }
}

export async function getAppointmentStats() {
  try {
    const spaId = await getSpaId()
    const [total, completed, cancelled] = await Promise.all([
      prisma.appointment.count({ where: { spaId } }),
      prisma.appointment.count({ where: { spaId, status: 'COMPLETED' } }),
      prisma.appointment.count({ where: { spaId, status: 'CANCELLED' } })
    ])
    return {
      success: true,
      data: {
        total,
        completed,
        cancelled
      },
    }
  } catch (error) {
    console.error('Error fetching appointment stats:', error)
    return {
      success: false,
      message: 'No se pudieron cargar las estadísticas de citas.',
    }
  }
}

export async function getAppointmentClients() {
  try {
    const spaId = await getSpaId()
    const clients = await prisma.client.findMany({
      where: { spaId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })
    return {
      success: true,
      data: clients,
    }
  } catch (error) {
    console.error('Error fetching clients for appointments:', error)
    return {
      success: false,
      message: 'No se pudieron cargar los clientes. Inténtalo de nuevo.',
    }
  }
}

export async function getAppointmentManicurists() {
  try {
    const spaId = await getSpaId()
    const manicurists = await prisma.manicurist.findMany({
      where: { spaId, isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })
    return {
      success: true,
      data: manicurists,
    }
  } catch (error) {
    console.error('Error fetching manicurists for appointments:', error)
    return {
      success: false,
      message: 'No se pudieron cargar las manicuristas. Inténtalo de nuevo.',
    }
  }
}

export async function getAppointmentServices() {
  try {
    const spaId = await getSpaId()
    const services = await prisma.service.findMany({
      where: { spaId },
      select: { id: true, type: true },
      orderBy: { type: 'asc' },
    })
    // Map to { id, name } for UI
    const servicesWithNames = services.map(service => ({
      id: service.id,
      name: service.type.replace(/_/g, ' ')
    }))
    return {
      success: true,
      data: servicesWithNames,
    }
  } catch (error) {
    console.error('Error fetching services for appointments:', error)
    return {
      success: false,
      message: 'No se pudieron cargar los servicios. Inténtalo de nuevo.',
    }
  }
}
