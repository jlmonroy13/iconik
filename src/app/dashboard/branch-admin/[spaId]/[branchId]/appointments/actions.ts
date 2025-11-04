'use server';

import { revalidatePath } from 'next/cache';
import { prisma, Prisma } from '@/lib/prisma';
import type { ServerActionResult } from '@/types';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
  cancelAppointmentSchema,
  preConfirmAppointmentSchema,
  addAppointmentServiceSchema,
} from '@/types/forms';
import { getAvailableManicuristsForService } from '../manicurists/queries';
import { getUserIdFromRequest } from '@/lib/auth';

/**
 * Get services assigned to a specific manicurist
 */
export async function getManicuristServices(
  manicuristId: string,
  spaId: string,
  branchId?: string
): Promise<
  ServerActionResult<
    Array<{
      id: string;
      name: string;
      price: number;
      duration: number;
      type: string;
    }>
  >
> {
  try {
    // Verify manicurist exists
    const manicurist = await prisma.manicurist.findUnique({
      where: { id: manicuristId },
      select: { id: true, spaId: true, branchId: true },
    });

    if (!manicurist) {
      return {
        success: false,
        error: 'Manicurista no encontrada',
      };
    }

    // Get services directly from ManicuristService with proper filtering
    const manicuristServices = await prisma.manicuristService.findMany({
      where: {
        manicuristId,
        isActive: true,
        spaId,
        ...(branchId && { branchId }),
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            type: true,
            isActive: true,
            spaId: true,
            branchId: true,
          },
        },
      },
    });

    // Filter services that are active and match branch if specified
    const services = manicuristServices
      .map(ms => ms.service)
      .filter(
        (service): service is NonNullable<typeof service> =>
          service !== null &&
          service.isActive === true &&
          service.spaId === spaId &&
          (!branchId || !service.branchId || service.branchId === branchId)
      )
      .map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        type: service.type,
      }));

    return {
      success: true,
      data: services,
    };
  } catch (error) {
    console.error('Error getting manicurist services:', error);
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Error al obtener servicios de la manicurista',
      };
    }
    return {
      success: false,
      error: 'Error inesperado al obtener servicios de la manicurista',
    };
  }
}

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

    // For walk-ins (IN_PROGRESS), record start time immediately
    const now = new Date();
    const shouldRecordStartTime = !validatedData.isScheduled;

    // Auto-assign appointment.manicuristId if all services have the same manicurist
    const allManicuristIds = validatedData.services.map(s => s.manicuristId);
    const uniqueManicuristIds = [...new Set(allManicuristIds)];
    const primaryManicuristId =
      uniqueManicuristIds.length === 1 ? uniqueManicuristIds[0] : null;

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
        // Auto-assign manicurist if all services have the same one
        ...(primaryManicuristId && { manicuristId: primaryManicuristId }),
        services: {
          create: validatedData.services.map(service => ({
            serviceId: service.serviceId,
            manicuristId: service.manicuristId,
            price: service.price,
            estimatedDuration: service.estimatedDuration,
            // For walk-ins, record start time immediately
            ...(shouldRecordStartTime && { startedAtByAdmin: now }),
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
      // Auto-assign appointment.manicuristId if all services have the same manicurist
      const allManicuristIds = validatedData.services.map(s => s.manicuristId);
      const uniqueManicuristIds = [...new Set(allManicuristIds)];
      const primaryManicuristId =
        uniqueManicuristIds.length === 1 ? uniqueManicuristIds[0] : null;

      // Update appointment.manicuristId based on services
      if (primaryManicuristId) {
        updateData.manicurist = { connect: { id: primaryManicuristId } };
      } else {
        // If services have different manicurists, clear appointment.manicuristId
        updateData.manicurist = { disconnect: true };
      }

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

    // Get appointment services for time tracking
    const appointmentServices = await prisma.appointmentService.findMany({
      where: {
        appointmentId,
      },
      select: {
        id: true,
        startedAtByAdmin: true,
        estimatedDuration: true,
      },
    });

    const now = new Date();

    // Use transaction to ensure consistency
    await prisma.$transaction(async tx => {
      // Update appointment status
      await tx.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          status: newStatus,
        },
      });

      // When starting appointment (SCHEDULED -> IN_PROGRESS)
      if (newStatus === 'IN_PROGRESS' && currentStatus === 'SCHEDULED') {
        // Update all services with start time
        await tx.appointmentService.updateMany({
          where: {
            appointmentId,
            startedAtByAdmin: null, // Only update if not already set
          },
          data: {
            startedAtByAdmin: now,
          },
        });
      }

      // When completing appointment (IN_PROGRESS -> COMPLETED)
      if (newStatus === 'COMPLETED' && currentStatus === 'IN_PROGRESS') {
        // Update all services with end time and calculate actual duration
        for (const service of appointmentServices) {
          if (service.startedAtByAdmin) {
            const startTime = new Date(service.startedAtByAdmin);
            const endTime = now;
            const actualDurationMinutes = Math.round(
              (endTime.getTime() - startTime.getTime()) / (1000 * 60)
            );

            await tx.appointmentService.update({
              where: {
                id: service.id,
              },
              data: {
                endedAtByAdmin: endTime,
                actualDuration: actualDurationMinutes,
              },
            });
          } else {
            // If no start time recorded, use estimated duration
            await tx.appointmentService.update({
              where: {
                id: service.id,
              },
              data: {
                endedAtByAdmin: now,
                actualDuration: service.estimatedDuration,
              },
            });
          }
        }
      }
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
 * Automatically complete appointment when payment is registered
 * This should be called after creating a payment for an appointment
 */
export async function autoCompleteAppointmentIfPaid(
  appointmentId: string,
  spaId: string
): Promise<ServerActionResult<void>> {
  try {
    // Get appointment with payments and services
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        payments: {
          select: {
            amount: true,
          },
        },
        services: {
          select: {
            id: true,
            price: true,
            startedAtByAdmin: true,
            estimatedDuration: true,
          },
        },
      },
    });

    if (!appointment) {
      return { success: false, error: 'Cita no encontrada' };
    }

    if (appointment.spaId !== spaId) {
      return { success: false, error: 'Cita no pertenece a este spa' };
    }

    // Don't auto-complete if already completed, cancelled, or no-show
    if (
      appointment.status === 'COMPLETED' ||
      appointment.status === 'CANCELLED' ||
      appointment.status === 'NO_SHOW'
    ) {
      return { success: true }; // Already in final state, nothing to do
    }

    // Calculate total amount due and total paid
    const totalDue = appointment.services.reduce(
      (sum, service) => sum + service.price,
      0
    );
    const totalPaid = appointment.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // If fully paid and not already completed, complete the appointment
    if (totalPaid >= totalDue && appointment.status !== 'COMPLETED') {
      const now = new Date();

      await prisma.$transaction(async tx => {
        // Ensure services have start time if appointment is being auto-completed
        // (might be completing from SCHEDULED status if payment was made early)
        if (appointment.status === 'SCHEDULED') {
          await tx.appointmentService.updateMany({
            where: {
              appointmentId,
              startedAtByAdmin: null,
            },
            data: {
              startedAtByAdmin: now,
            },
          });
        }

        // Update appointment status
        await tx.appointment.update({
          where: { id: appointmentId },
          data: {
            status: 'COMPLETED',
          },
        });

        // Update all services with end time and calculate actual duration
        for (const service of appointment.services) {
          // Re-fetch service to get updated startedAtByAdmin if it was just set
          const updatedService = await tx.appointmentService.findUnique({
            where: { id: service.id },
            select: {
              startedAtByAdmin: true,
              estimatedDuration: true,
            },
          });

          if (updatedService?.startedAtByAdmin) {
            const startTime = new Date(updatedService.startedAtByAdmin);
            const endTime = now;
            const actualDurationMinutes = Math.round(
              (endTime.getTime() - startTime.getTime()) / (1000 * 60)
            );

            await tx.appointmentService.update({
              where: {
                id: service.id,
              },
              data: {
                endedAtByAdmin: endTime,
                actualDuration: actualDurationMinutes,
              },
            });
          } else {
            // If no start time recorded, use estimated duration
            await tx.appointmentService.update({
              where: {
                id: service.id,
              },
              data: {
                endedAtByAdmin: now,
                actualDuration:
                  updatedService?.estimatedDuration ||
                  service.estimatedDuration,
              },
            });
          }
        }
      });

      // Revalidate the appointments page
      revalidatePath(`/dashboard/branch-admin/${spaId}/*/appointments`);

      return { success: true };
    }

    return { success: true }; // Not fully paid yet, nothing to do
  } catch (error) {
    console.error('Error auto-completing appointment:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error inesperado al completar la cita automáticamente',
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
 * Pre-confirm an appointment (24-48h before scheduled time)
 */
export async function preConfirmAppointment(
  appointmentId: string,
  spaId: string,
  branchId: string,
  data: unknown
): Promise<ServerActionResult<void>> {
  try {
    // Validate input
    const validatedData = preConfirmAppointmentSchema.parse(data);

    // Get current user ID
    const userId = await getUserIdFromRequest();

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

    // Can only pre-confirm scheduled appointments
    if (existingAppointment.status !== 'SCHEDULED') {
      return {
        success: false,
        error: 'Solo se pueden pre-confirmar citas agendadas',
      };
    }

    // Check if appointment is scheduled for future (at least 2 hours ahead)
    const scheduledTime = new Date(existingAppointment.scheduledAt);
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    if (scheduledTime < twoHoursFromNow) {
      return {
        success: false,
        error: 'No se puede pre-confirmar una cita que es en menos de 2 horas',
      };
    }

    // Update appointment with pre-confirmation data
    await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        requiresPreConfirmation: true,
        preConfirmedBy: userId,
        preConfirmedAt: new Date(),
        preConfirmationNotes: validatedData.notes || null,
      },
    });

    // Revalidate the appointments page
    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/appointments`);

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('Error pre-confirming appointment:', error);

    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        return {
          success: false,
          error: 'No autorizado para pre-confirmar citas',
        };
      }
      return {
        success: false,
        error: error.message || 'Error al pre-confirmar la cita',
      };
    }

    return {
      success: false,
      error: 'Error inesperado al pre-confirmar la cita',
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
 * Get available manicurists for a service, date, and time
 * This filters manicurists based on:
 * - Service assignment
 * - Schedule availability
 * - Time conflicts with existing appointments
 */
export async function getAvailableManicurists(
  spaId: string,
  branchId: string,
  serviceId: string,
  scheduledAt: string, // ISO string
  durationMinutes: number,
  isScheduled: boolean,
  excludeAppointmentId?: string
): Promise<
  ServerActionResult<
    Array<{
      id: string;
      name: string;
      commission: number;
      isActive: boolean;
    }>
  >
> {
  try {
    // For walk-in, use current time
    const scheduledDate = isScheduled ? new Date(scheduledAt) : new Date();

    // Get available manicurists
    const manicurists = await getAvailableManicuristsForService(
      spaId,
      branchId,
      serviceId,
      scheduledDate,
      durationMinutes,
      excludeAppointmentId
    );

    return {
      success: true,
      data: manicurists,
    };
  } catch (error) {
    console.error('Error getting available manicurists:', error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Error al obtener manicuristas disponibles',
      };
    }

    return {
      success: false,
      error: 'Error inesperado al obtener manicuristas disponibles',
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
