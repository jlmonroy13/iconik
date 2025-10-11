'use server';

import { auth } from '@/../../auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  createManicuristSchema,
  updateScheduleSchema,
  updateManicuristServicesSchema,
  createAvailabilitySchema,
  type CreateAvailabilityData,
} from '@/types/forms';
import type { ServerActionResult } from '@/types/api';
import type { ManicuristAvailability } from '@/generated/prisma';
import { getManicuristById } from './queries';

// ============================================
// READ ACTIONS (for Client Components)
// ============================================

/**
 * Fetch single manicurist with full details
 */
export async function fetchManicuristById(id: string) {
  try {
    return await getManicuristById(id);
  } catch (error) {
    console.error('Error fetching manicurist:', error);
    throw error;
  }
}

// ============================================
// MUTATION ACTIONS - MANICURIST CRUD
// ============================================

/**
 * Create new manicurist
 */
export async function createManicurist(
  spaId: string,
  branchId: string,
  data: Record<string, unknown>
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify access to this branch
    if (session.user.branchId !== branchId) {
      throw new Error('No tienes acceso a esta sede');
    }

    // Validate data
    const validatedData = createManicuristSchema.parse(data);

    // Create manicurist
    const manicurist = await prisma.manicurist.create({
      data: {
        name: validatedData.name,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        commission: validatedData.commission,
        isActive: validatedData.isActive,
        spaId,
        branchId,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/manicurists`);

    return { success: true, data: manicurist };
  } catch (error) {
    console.error('Error creating manicurist:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al crear manicurista',
    };
  }
}

/**
 * Update existing manicurist
 */
export async function updateManicurist(
  manicuristId: string,
  spaId: string,
  branchId: string,
  data: Record<string, unknown>
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      throw new Error('No tienes acceso a esta sede');
    }

    // Validate data
    const validatedData = createManicuristSchema.parse(data);

    // Update manicurist
    const manicurist = await prisma.manicurist.update({
      where: { id: manicuristId },
      data: {
        name: validatedData.name,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        commission: validatedData.commission,
        isActive: validatedData.isActive,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/manicurists`);

    return { success: true, data: manicurist };
  } catch (error) {
    console.error('Error updating manicurist:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar manicurista',
    };
  }
}

/**
 * Delete manicurist
 */
export async function deleteManicurist(
  manicuristId: string,
  spaId: string,
  branchId: string
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      throw new Error('No tienes acceso a esta sede');
    }

    // Check for dependencies
    const manicurist = await prisma.manicurist.findUnique({
      where: { id: manicuristId },
      include: {
        _count: {
          select: {
            appointments: true,
            commissions: true,
          },
        },
      },
    });

    if (!manicurist) {
      throw new Error('Manicurista no encontrada');
    }

    if (manicurist._count.appointments > 0) {
      throw new Error(
        'No se puede eliminar una manicurista con citas asociadas. Considera desactivarla en su lugar.'
      );
    }

    // Delete manicurist (cascade will delete related records)
    await prisma.manicurist.delete({
      where: { id: manicuristId },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/manicurists`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting manicurist:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al eliminar manicurista',
    };
  }
}

// ============================================
// SERVICES ASSIGNMENT
// ============================================

/**
 * Update manicurist services
 */
export async function updateManicuristServices(
  manicuristId: string,
  spaId: string,
  branchId: string,
  data: Record<string, unknown>
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      throw new Error('No tienes acceso a esta sede');
    }

    // Validate data
    const validatedData = updateManicuristServicesSchema.parse(data);

    // Use transaction for atomicity
    await prisma.$transaction(async tx => {
      // Delete existing services
      await tx.manicuristService.deleteMany({
        where: { manicuristId },
      });

      // Create new assignments
      if (validatedData.serviceIds.length > 0) {
        await tx.manicuristService.createMany({
          data: validatedData.serviceIds.map(serviceId => ({
            manicuristId,
            serviceId,
            spaId,
            branchId,
            isActive: true,
          })),
        });
      }
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/manicurists`);

    return { success: true };
  } catch (error) {
    console.error('Error updating manicurist services:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar servicios',
    };
  }
}

// ============================================
// SCHEDULE MANAGEMENT
// ============================================

/**
 * Update manicurist weekly schedule
 */
export async function updateManicuristSchedule(
  manicuristId: string,
  spaId: string,
  branchId: string,
  data: Record<string, unknown>
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      throw new Error('No tienes acceso a esta sede');
    }

    // Validate data
    const validatedData = updateScheduleSchema.parse(data);

    // Use transaction
    await prisma.$transaction(async tx => {
      // Delete existing schedules
      await tx.manicuristSchedule.deleteMany({
        where: { manicuristId },
      });

      // Create new schedules (only active days)
      const activeSchedules = validatedData.schedules.filter(s => s.isActive);

      if (activeSchedules.length > 0) {
        await tx.manicuristSchedule.createMany({
          data: activeSchedules.map(schedule => ({
            manicuristId,
            spaId,
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            isActive: true,
          })),
        });
      }
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/manicurists`);

    return { success: true };
  } catch (error) {
    console.error('Error updating manicurist schedule:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al actualizar horarios',
    };
  }
}

// ============================================
// AVAILABILITY MANAGEMENT
// ============================================

/**
 * Create availability exception
 */
export async function createAvailabilityException(
  manicuristId: string,
  spaId: string,
  branchId: string,
  data: CreateAvailabilityData
): Promise<ServerActionResult<ManicuristAvailability>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      return { success: false, error: 'No tienes acceso a esta sede' };
    }

    // Validate data
    const validatedData = createAvailabilitySchema.parse(data);

    // Convert date string to DateTime (YYYY-MM-DD to Date object)
    const date = new Date(validatedData.date + 'T00:00:00');

    // Create availability exception
    // If allDay is true, startTime and endTime will be null
    // If allDay is false, startTime and endTime will contain the specific hours
    const availability = await prisma.manicuristAvailability.create({
      data: {
        manicuristId,
        spaId,
        date,
        isAvailable: false, // Exceptions are always for unavailable periods
        startTime: validatedData.allDay
          ? null
          : validatedData.startTime || null,
        endTime: validatedData.allDay ? null : validatedData.endTime || null,
        reason: validatedData.reason || null,
      },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/manicurists`);

    return { success: true, data: availability };
  } catch (error) {
    console.error('Error creating availability exception:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al crear excepción',
    };
  }
}

/**
 * Delete availability exception
 */
export async function deleteAvailabilityException(
  availabilityId: string,
  spaId: string,
  branchId: string
): Promise<ServerActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'BRANCH_ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    // Verify access
    if (session.user.branchId !== branchId) {
      return { success: false, error: 'No tienes acceso a esta sede' };
    }

    // Delete availability exception
    await prisma.manicuristAvailability.delete({
      where: { id: availabilityId },
    });

    revalidatePath(`/dashboard/branch-admin/${spaId}/${branchId}/manicurists`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting availability exception:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al eliminar excepción',
    };
  }
}
