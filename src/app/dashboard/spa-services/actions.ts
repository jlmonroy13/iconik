'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getCurrentSpaId } from '@/lib/utils/spa-utils'
import { serviceFormSchema, type ServiceFormData } from './schemas'

// Helper function to get spa ID from session
async function getSpaId() {
  return await getCurrentSpaId()
}

export async function getServices() {
  try {
    const spaId = await getSpaId()

    const services = await prisma.service.findMany({
      where: { spaId },
      orderBy: [
        { isActive: 'desc' },
        { name: 'asc' }
      ],
    })

    return {
      success: true,
      data: services,
    }
  } catch (error) {
    console.error('Error fetching services:', error)
    return {
      success: false,
      message: 'No se pudieron cargar los servicios. Inténtalo de nuevo.',
    }
  }
}

export async function getService(id: string) {
  try {
    const spaId = await getSpaId()

    const service = await prisma.service.findFirst({
      where: {
        id,
        spaId
      },
    })

    if (!service) {
      return {
        success: false,
        message: 'Servicio no encontrado.',
      }
    }

    return {
      success: true,
      data: service,
    }
  } catch (error) {
    console.error('Error fetching service:', error)
    return {
      success: false,
      message: 'No se pudo cargar el servicio. Inténtalo de nuevo.',
    }
  }
}

export async function createService(data: ServiceFormData) {
  try {
    const spaId = await getSpaId()
    const validatedData = serviceFormSchema.parse(data)

    const service = await prisma.service.create({
      data: {
        ...validatedData,
        spaId,
        type: "OTHER",
      },
    })

    revalidatePath('/dashboard/spa-services')

    return {
      success: true,
      data: service,
    }
  } catch (error) {
    console.error('Error creating service:', error)
    return {
      success: false,
      message: 'No se pudo crear el servicio. Inténtalo de nuevo.',
    }
  }
}

export async function updateService(id: string, data: ServiceFormData) {
  try {
    const spaId = await getSpaId()
    const validatedData = serviceFormSchema.parse(data)

    // Verify the service belongs to the spa
    const existingService = await prisma.service.findFirst({
      where: {
        id,
        spaId
      },
    })

    if (!existingService) {
      return {
        success: false,
        message: 'Servicio no encontrado.',
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: validatedData,
    })

    revalidatePath('/dashboard/spa-services')

    return {
      success: true,
      data: service,
    }
  } catch (error) {
    console.error('Error updating service:', error)
    return {
      success: false,
      message: 'No se pudo actualizar el servicio. Inténtalo de nuevo.',
    }
  }
}

export async function deleteService(id: string) {
  try {
    const spaId = await getSpaId()

    // Verify the service belongs to the spa
    const existingService = await prisma.service.findFirst({
      where: {
        id,
        spaId
      },
    })

    if (!existingService) {
      return {
        success: false,
        message: 'Servicio no encontrado.',
      }
    }

    // Check if service is being used in appointments
    const appointmentServices = await prisma.appointmentService.findMany({
      where: { serviceId: id },
      take: 1,
    })

    if (appointmentServices.length > 0) {
      return {
        success: false,
        message: 'No se puede eliminar el servicio porque está siendo utilizado en citas.',
      }
    }

    await prisma.service.delete({
      where: { id },
    })

    revalidatePath('/dashboard/spa-services')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting service:', error)
    return {
      success: false,
      message: 'No se pudo eliminar el servicio. Inténtalo de nuevo.',
    }
  }
}

export async function toggleServiceStatus(id: string) {
  try {
    const spaId = await getSpaId()

    // Verify the service belongs to the spa
    const existingService = await prisma.service.findFirst({
      where: {
        id,
        spaId
      },
    })

    if (!existingService) {
      return {
        success: false,
        message: 'Servicio no encontrado.',
      }
    }

    const service = await prisma.service.update({
      where: { id },
      data: { isActive: !existingService.isActive },
    })

    revalidatePath('/dashboard/spa-services')

    return {
      success: true,
      data: service,
    }
  } catch (error) {
    console.error('Error toggling service status:', error)
    return {
      success: false,
      message: 'No se pudo cambiar el estado del servicio. Inténtalo de nuevo.',
    }
  }
}

export async function getServiceStats() {
  try {
    const spaId = await getSpaId()

    const [
      totalServices,
      activeServices,
      inactiveServices,
      servicesWithAppointments
    ] = await Promise.all([
      prisma.service.count({ where: { spaId } }),
      prisma.service.count({ where: { spaId, isActive: true } }),
      prisma.service.count({ where: { spaId, isActive: false } }),
      prisma.appointmentService.groupBy({
        by: ['serviceId'],
        where: {
          service: { spaId }
        },
        _count: {
          serviceId: true
        },
        orderBy: {
          _count: {
            serviceId: 'desc'
          }
        },
        take: 1
      })
    ])

    // Get the most requested service name
    let mostRequestedServiceName = 'N/A'
    if (servicesWithAppointments.length > 0) {
      const mostRequestedService = await prisma.service.findUnique({
        where: { id: servicesWithAppointments[0].serviceId }
      })
      mostRequestedServiceName = mostRequestedService?.name || 'N/A'
    }

    return {
      success: true,
      data: {
        total: totalServices,
        active: activeServices,
        inactive: inactiveServices,
        mostRequestedServiceName,
      }
    }
  } catch (error) {
    console.error('Error fetching service stats:', error)
    return {
      success: false,
      message: 'No se pudieron cargar las estadísticas de servicios.',
      data: {
        total: 0,
        active: 0,
        inactive: 0,
        mostRequestedServiceName: 'N/A',
      }
    }
  }
}

export async function duplicateService(id: string) {
  try {
    const spaId = await getSpaId()

    // Get the original service
    const originalService = await prisma.service.findFirst({
      where: {
        id,
        spaId
      },
    })

    if (!originalService) {
      return {
        success: false,
        message: 'Servicio no encontrado.',
      }
    }

    // Create a duplicate with "Copia" suffix
    const duplicateName = `${originalService.name} (Copia)`

    const duplicatedService = await prisma.service.create({
      data: {
        type: originalService.type,
        name: duplicateName,
        description: originalService.description,
        price: originalService.price,
        kitCost: originalService.kitCost,
        taxRate: originalService.taxRate,
        duration: originalService.duration,
        imageUrl: originalService.imageUrl,
        isActive: false, // Start as inactive
        spaId,
      },
    })

    revalidatePath('/dashboard/spa-services')

    return {
      success: true,
      data: duplicatedService,
    }
  } catch (error) {
    console.error('Error duplicating service:', error)
    return {
      success: false,
      message: 'No se pudo duplicar el servicio. Inténtalo de nuevo.',
    }
  }
}
