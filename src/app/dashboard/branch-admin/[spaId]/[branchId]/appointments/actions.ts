'use server';

import { revalidatePath } from 'next/cache';
import { prisma, Prisma } from '@/lib/prisma';
import type { ServerActionResult } from '@/types';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
  cancelAppointmentSchema,
  addAppointmentServiceSchema,
} from '@/types/forms';

// =====================================================
// SERVER ACTIONS
// =====================================================

/**
 * Create a new appointment
 */
export async function createAppointment(
  spaId: string,
  branchId: string,
  data: unknown
): Promise<ServerActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedData = createAppointmentSchema.parse(data);

    // Determine initial status based on isScheduled
    const initialStatus = validatedData.isScheduled
      ? 'SCHEDULED'
      : 'IN_PROGRESS';

    // For walk-ins, use current time if scheduledAt is in the future
    const scheduledAt = validatedData.isScheduled
      ? new Date(validatedData.scheduledAt)
      : new Date();

    // Create appointment with services
    const appointment = await prisma.appointment.create({
      data: {
        spaId,
        branchId,
        clientId: validatedData.clientId,
        scheduledAt,
        isScheduled: validatedData.isScheduled,
        status: initialStatus,
        notes: validatedData.notes || null,
        services: {
          create: validatedData.services.map(service => ({
            serviceId: service.serviceId,
            manicuristId: service.manicuristId,
            price: service.price,
            estimatedDuration: service.estimatedDuration,
          })),
        },
      },
      select: {
        id: true,
      },
    });

    // Revalidate the appointments page
    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/appointments`);

    return {
      success: true,
      data: { id: appointment.id },
    };
  } catch (error) {
    console.error('Error creating appointment:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Error al crear la cita',
      };
    }

    return {
      success: false,
      error: 'Error inesperado al crear la cita',
    };
  }
}

/**
 * Update an existing appointment
 */
export async function updateAppointment(
  appointmentId: string,
  spaId: string,
  branchId: string,
  data: unknown
): Promise<ServerActionResult<{ id: string }>> {
  try {
    // Validate input
    const validatedData = updateAppointmentSchema.parse(data);

    // Check if appointment exists and belongs to this spa
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        spaId,
      },
      include: {
        payments: true,
      },
    });

    if (!existingAppointment) {
      return {
        success: false,
        error: 'Cita no encontrada',
      };
    }

    // Check if appointment is completed and has payments
    if (
      existingAppointment.status === 'COMPLETED' &&
      existingAppointment.payments.length > 0
    ) {
      return {
        success: false,
        error:
          'No se puede editar una cita completada con pagos registrados. Por favor, gestiona los pagos primero.',
      };
    }

    // Prepare update data
    const updateData: Prisma.AppointmentUpdateInput = {};

    if (validatedData.clientId !== undefined) {
      updateData.client = { connect: { id: validatedData.clientId } };
    }

    if (validatedData.scheduledAt !== undefined) {
      updateData.scheduledAt = new Date(validatedData.scheduledAt);
    }

    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes || null;
    }

    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
    }

    // Handle services update if provided
    if (validatedData.services) {
      // Delete existing services and create new ones
      await prisma.appointmentService.deleteMany({
        where: {
          appointmentId,
        },
      });

      updateData.services = {
        create: validatedData.services.map(service => ({
          serviceId: service.serviceId,
          manicuristId: service.manicuristId,
          price: service.price,
          estimatedDuration: service.estimatedDuration,
        })),
      };
    }

    // Update appointment
    const appointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: updateData,
      select: {
        id: true,
      },
    });

    // Revalidate the appointments page
    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/appointments`);

    return {
      success: true,
      data: { id: appointment.id },
    };
  } catch (error) {
    console.error('Error updating appointment:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Error al actualizar la cita',
      };
    }

    return {
      success: false,
      error: 'Error inesperado al actualizar la cita',
    };
  }
}

/**
 * Update appointment status only
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  spaId: string,
  branchId: string,
  data: unknown
): Promise<ServerActionResult<void>> {
  try {
    // Validate input
    const validatedData = updateAppointmentStatusSchema.parse(data);

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        spaId,
      },
    });

    if (!existingAppointment) {
      return {
        success: false,
        error: 'Cita no encontrada',
      };
    }

    // Validate status transitions
    const currentStatus = existingAppointment.status;
    const newStatus = validatedData.status;

    // Define valid transitions
    const validTransitions: Record<string, string[]> = {
      PENDING_APPROVAL: ['SCHEDULED', 'CANCELLED'],
      SCHEDULED: ['IN_PROGRESS', 'CANCELLED', 'NO_SHOW'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [], // No transitions allowed from completed
      CANCELLED: [], // No transitions allowed from cancelled
      NO_SHOW: [], // No transitions allowed from no-show
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      return {
        success: false,
        error: `No se puede cambiar el estado de ${currentStatus} a ${newStatus}`,
      };
    }

    // Update status
    await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: newStatus,
      },
    });

    // Revalidate the appointments page
    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/appointments`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('Error updating appointment status:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Error al actualizar el estado',
      };
    }

    return {
      success: false,
      error: 'Error inesperado al actualizar el estado',
    };
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
  appointmentId: string,
  spaId: string,
  branchId: string,
  data: unknown
): Promise<ServerActionResult<void>> {
  try {
    // Validate input
    const validatedData = cancelAppointmentSchema.parse(data);

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        spaId,
      },
    });

    if (!existingAppointment) {
      return {
        success: false,
        error: 'Cita no encontrada',
      };
    }

    // Cannot cancel completed appointments
    if (existingAppointment.status === 'COMPLETED') {
      return {
        success: false,
        error: 'No se puede cancelar una cita completada',
      };
    }

    // Update appointment status to cancelled
    await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status: 'CANCELLED',
        notes: validatedData.reason
          ? `${existingAppointment.notes || ''}\n\nMotivo de cancelación: ${validatedData.reason}`
          : existingAppointment.notes,
      },
    });

    // Revalidate the appointments page
    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/appointments`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('Error cancelling appointment:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Error al cancelar la cita',
      };
    }

    return {
      success: false,
      error: 'Error inesperado al cancelar la cita',
    };
  }
}

/**
 * Delete an appointment permanently
 */
export async function deleteAppointment(
  appointmentId: string,
  spaId: string,
  branchId: string
): Promise<ServerActionResult<void>> {
  try {
    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        spaId,
      },
      include: {
        payments: true,
      },
    });

    if (!existingAppointment) {
      return {
        success: false,
        error: 'Cita no encontrada',
      };
    }

    // Cannot delete if has payments
    if (existingAppointment.payments.length > 0) {
      return {
        success: false,
        error:
          'No se puede eliminar una cita con pagos registrados. Por favor, elimina los pagos primero.',
      };
    }

    // Delete appointment (cascade will delete services)
    await prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    });

    // Revalidate the appointments page
    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/appointments`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('Error deleting appointment:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Error al eliminar la cita',
      };
    }

    return {
      success: false,
      error: 'Error inesperado al eliminar la cita',
    };
  }
}

/**
 * Add a service to an existing appointment
 */
export async function addServiceToAppointment(
  appointmentId: string,
  spaId: string,
  branchId: string,
  data: unknown
): Promise<ServerActionResult<void>> {
  try {
    // Validate input
    const validatedData = addAppointmentServiceSchema.parse(data);

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        spaId,
      },
    });

    if (!existingAppointment) {
      return {
        success: false,
        error: 'Cita no encontrada',
      };
    }

    // Cannot add services to cancelled or no-show appointments
    if (['CANCELLED', 'NO_SHOW'].includes(existingAppointment.status)) {
      return {
        success: false,
        error:
          'No se pueden agregar servicios a una cita cancelada o no presentada',
      };
    }

    // Add service to appointment
    await prisma.appointmentService.create({
      data: {
        appointmentId,
        serviceId: validatedData.serviceId,
        manicuristId: validatedData.manicuristId,
        price: validatedData.price,
        estimatedDuration: validatedData.estimatedDuration,
      },
    });

    // Revalidate the appointments page
    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/appointments`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('Error adding service to appointment:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Error al agregar el servicio',
      };
    }

    return {
      success: false,
      error: 'Error inesperado al agregar el servicio',
    };
  }
}

/**
 * Remove a service from an appointment
 */
export async function removeServiceFromAppointment(
  appointmentServiceId: string,
  spaId: string,
  branchId: string
): Promise<ServerActionResult<void>> {
  try {
    // Check if service exists and get appointment info
    const service = await prisma.appointmentService.findUnique({
      where: {
        id: appointmentServiceId,
      },
      include: {
        appointment: {
          select: {
            id: true,
            spaId: true,
            status: true,
          },
        },
      },
    });

    if (!service) {
      return {
        success: false,
        error: 'Servicio no encontrado',
      };
    }

    // Verify appointment belongs to this spa
    if (service.appointment.spaId !== spaId) {
      return {
        success: false,
        error: 'Acceso denegado',
      };
    }

    // Cannot remove services from completed appointments with payments
    if (service.appointment.status === 'COMPLETED') {
      const hasPayments = await prisma.payment.findFirst({
        where: {
          appointmentServiceId: appointmentServiceId,
        },
      });

      if (hasPayments) {
        return {
          success: false,
          error:
            'No se puede eliminar un servicio con pagos registrados. Por favor, gestiona los pagos primero.',
        };
      }
    }

    // Check if this is the last service
    const serviceCount = await prisma.appointmentService.count({
      where: {
        appointmentId: service.appointment.id,
      },
    });

    if (serviceCount <= 1) {
      return {
        success: false,
        error:
          'No se puede eliminar el último servicio. La cita debe tener al menos un servicio.',
      };
    }

    // Delete service
    await prisma.appointmentService.delete({
      where: {
        id: appointmentServiceId,
      },
    });

    // Revalidate the appointments page
    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/appointments`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('Error removing service from appointment:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Error al eliminar el servicio',
      };
    }

    return {
      success: false,
      error: 'Error inesperado al eliminar el servicio',
    };
  }
}
