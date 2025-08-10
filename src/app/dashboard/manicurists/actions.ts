'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentSpaId } from '@/lib/utils/spa-utils';
import { manicuristFormSchema, type ManicuristFormData } from './schemas';

// Helper function to get spa ID from session
async function getSpaId() {
  return await getCurrentSpaId();
}

export async function getManicurists() {
  try {
    const spaId = await getSpaId();
    const manicurists = await prisma.manicurist.findMany({
      where: { spaId },
      include: {
        schedules: true,
        availability: true,
      },
      orderBy: [{ isActive: 'desc' }, { name: 'asc' }],
    });
    return {
      success: true,
      data: manicurists,
    };
  } catch (error) {
    console.error('Error fetching manicurists:', error);
    return {
      success: false,
      message: 'No se pudieron cargar las manicuristas. Inténtalo de nuevo.',
    };
  }
}

export async function getManicurist(id: string) {
  try {
    const spaId = await getSpaId();
    const manicurist = await prisma.manicurist.findFirst({
      where: { id, spaId },
    });
    if (!manicurist) {
      return {
        success: false,
        message: 'Manicurista no encontrada.',
      };
    }
    return {
      success: true,
      data: manicurist,
    };
  } catch (error) {
    console.error('Error fetching manicurist:', error);
    return {
      success: false,
      message: 'No se pudo cargar la manicurista. Inténtalo de nuevo.',
    };
  }
}

export async function createManicurist(data: ManicuristFormData) {
  try {
    const spaId = await getSpaId();
    const validatedData = manicuristFormSchema.parse(data);
    const { selectedServices, schedules, availability, ...manicuristData } =
      validatedData;

    const manicurist = await prisma.manicurist.create({
      data: {
        ...manicuristData,
        spaId,
        schedules:
          schedules && schedules.length > 0
            ? { create: schedules.map(s => ({ ...s, spaId })) }
            : undefined,
        availability:
          availability && availability.length > 0
            ? { create: availability.map(a => ({ ...a, spaId })) }
            : undefined,
      },
    });

    // Create service relationships if services are selected
    if (selectedServices && selectedServices.length > 0) {
      await prisma.manicuristServiceDuration.createMany({
        data: selectedServices.map(serviceId => ({
          manicuristId: manicurist.id,
          serviceId,
          spaId,
          duration: 0, // Default duration, can be updated later
        })),
      });
    }

    revalidatePath('/dashboard/manicurists');
    return {
      success: true,
      data: manicurist,
    };
  } catch (error) {
    console.error('Error creating manicurist:', error);
    return {
      success: false,
      message: 'No se pudo crear la manicurista. Inténtalo de nuevo.',
    };
  }
}

export async function updateManicurist(id: string, data: ManicuristFormData) {
  try {
    const spaId = await getSpaId();
    const validatedData = manicuristFormSchema.parse(data);
    const { selectedServices, schedules, availability, ...manicuristData } =
      validatedData;

    const existingManicurist = await prisma.manicurist.findFirst({
      where: { id, spaId },
    });
    if (!existingManicurist) {
      return {
        success: false,
        message: 'Manicurista no encontrada.',
      };
    }

    // Remove existing schedules and availability (simple approach)
    await prisma.manicuristSchedule.deleteMany({
      where: { manicuristId: id, spaId },
    });
    await prisma.manicuristAvailability.deleteMany({
      where: { manicuristId: id, spaId },
    });

    // Update manicurist data
    const manicurist = await prisma.manicurist.update({
      where: { id },
      data: {
        ...manicuristData,
        schedules:
          schedules && schedules.length > 0
            ? { create: schedules.map(s => ({ ...s, spaId })) }
            : undefined,
        availability:
          availability && availability.length > 0
            ? { create: availability.map(a => ({ ...a, spaId })) }
            : undefined,
      },
    });

    // Update service relationships
    await prisma.manicuristServiceDuration.deleteMany({
      where: { manicuristId: id, spaId },
    });
    if (selectedServices && selectedServices.length > 0) {
      await prisma.manicuristServiceDuration.createMany({
        data: selectedServices.map(serviceId => ({
          manicuristId: id,
          serviceId,
          spaId,
          duration: 0,
        })),
      });
    }

    revalidatePath('/dashboard/manicurists');
    return {
      success: true,
      data: manicurist,
    };
  } catch (error) {
    console.error('Error updating manicurist:', error);
    return {
      success: false,
      message: 'No se pudo actualizar la manicurista. Inténtalo de nuevo.',
    };
  }
}

export async function deleteManicurist(id: string) {
  try {
    const spaId = await getSpaId();
    const existingManicurist = await prisma.manicurist.findFirst({
      where: { id, spaId },
    });
    if (!existingManicurist) {
      return {
        success: false,
        message: 'Manicurista no encontrada.',
      };
    }
    await prisma.manicurist.delete({
      where: { id },
    });
    revalidatePath('/dashboard/manicurists');
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting manicurist:', error);
    return {
      success: false,
      message: 'No se pudo eliminar la manicurista. Inténtalo de nuevo.',
    };
  }
}

export async function getManicuristStats() {
  try {
    const spaId = await getSpaId();
    const [total, active] = await Promise.all([
      prisma.manicurist.count({ where: { spaId } }),
      prisma.manicurist.count({ where: { spaId, isActive: true } }),
    ]);
    // Puedes agregar más estadísticas aquí si lo deseas
    return {
      success: true,
      data: {
        total,
        active,
        inactive: total - active,
      },
    };
  } catch (error) {
    console.error('Error fetching manicurist stats:', error);
    return {
      success: false,
      message: 'No se pudieron cargar las estadísticas de manicuristas.',
    };
  }
}

export async function getServicesForManicuristForm() {
  try {
    const spaId = await getSpaId();
    const services = await prisma.service.findMany({
      where: { spaId, isActive: true },
      orderBy: [{ name: 'asc' }],
    });
    return {
      success: true,
      data: services,
    };
  } catch (error) {
    console.error('Error fetching services for manicurist form:', error);
    return {
      success: false,
      message: 'No se pudieron cargar los servicios.',
    };
  }
}

export async function getManicuristServices(manicuristId: string) {
  try {
    const spaId = await getSpaId();
    const serviceDurations = await prisma.manicuristServiceDuration.findMany({
      where: { manicuristId, spaId },
      select: { serviceId: true },
    });
    return {
      success: true,
      data: serviceDurations.map(sd => sd.serviceId),
    };
  } catch (error) {
    console.error('Error fetching manicurist services:', error);
    return {
      success: false,
      message: 'No se pudieron cargar los servicios de la manicurista.',
    };
  }
}
