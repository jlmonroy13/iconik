'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentSpaId } from '@/lib/utils/spa-utils';
import { clientFormSchema, type ClientFormData } from './schemas';

// Helper function to get spa ID from session
async function getSpaId() {
  return await getCurrentSpaId();
}

export async function getClients() {
  try {
    const spaId = await getSpaId();

    const clients = await prisma.client.findMany({
      where: { spaId },
      orderBy: [{ createdAt: 'desc' }],
    });

    return {
      success: true,
      data: clients,
    };
  } catch (error) {
    console.error('Error fetching clients:', error);
    return {
      success: false,
      message: 'No se pudieron cargar los clientes. Inténtalo de nuevo.',
    };
  }
}

export async function getClient(id: string) {
  try {
    const spaId = await getSpaId();

    const client = await prisma.client.findFirst({
      where: {
        id,
        spaId,
      },
    });

    if (!client) {
      return {
        success: false,
        message: 'Cliente no encontrado.',
      };
    }

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    console.error('Error fetching client:', error);
    return {
      success: false,
      message: 'No se pudo cargar el cliente. Inténtalo de nuevo.',
    };
  }
}

export async function createClient(data: ClientFormData) {
  try {
    const spaId = await getSpaId();
    const validatedData = clientFormSchema.parse(data);
    const birthday =
      validatedData.birthday && validatedData.birthday !== ''
        ? new Date(validatedData.birthday)
        : undefined;

    const client = await prisma.client.create({
      data: {
        ...validatedData,
        spaId,
        birthday,
      },
    });

    revalidatePath('/dashboard/clients');

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    console.error('Error creating client:', error);
    return {
      success: false,
      message: 'No se pudo crear el cliente. Inténtalo de nuevo.',
    };
  }
}

export async function updateClient(id: string, data: ClientFormData) {
  try {
    const spaId = await getSpaId();
    const validatedData = clientFormSchema.parse(data);
    const birthday =
      validatedData.birthday && validatedData.birthday !== ''
        ? new Date(validatedData.birthday)
        : undefined;

    // Verify the client belongs to the spa
    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        spaId,
      },
    });

    if (!existingClient) {
      return {
        success: false,
        message: 'Cliente no encontrado.',
      };
    }

    const client = await prisma.client.update({
      where: { id },
      data: {
        ...validatedData,
        birthday,
      },
    });

    revalidatePath('/dashboard/clients');

    return {
      success: true,
      data: client,
    };
  } catch (error) {
    console.error('Error updating client:', error);
    return {
      success: false,
      message: 'No se pudo actualizar el cliente. Inténtalo de nuevo.',
    };
  }
}

export async function deleteClient(id: string) {
  try {
    const spaId = await getSpaId();

    // Verify the client belongs to the spa
    const existingClient = await prisma.client.findFirst({
      where: {
        id,
        spaId,
      },
    });

    if (!existingClient) {
      return {
        success: false,
        message: 'Cliente no encontrado.',
      };
    }

    // Check if client is being used in appointments
    const appointments = await prisma.appointment.findMany({
      where: { clientId: id },
      take: 1,
    });

    if (appointments.length > 0) {
      return {
        success: false,
        message:
          'No se puede eliminar el cliente porque tiene citas asociadas.',
      };
    }

    await prisma.client.delete({
      where: { id },
    });

    revalidatePath('/dashboard/clients');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting client:', error);
    return {
      success: false,
      message: 'No se pudo eliminar el cliente. Inténtalo de nuevo.',
    };
  }
}

export async function getClientStats() {
  try {
    const spaId = await getSpaId();

    const [totalClients, recentClients] = await Promise.all([
      prisma.client.count({
        where: { spaId },
      }),
      prisma.client.count({
        where: {
          spaId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        total: totalClients,
        recent: recentClients,
      },
    };
  } catch (error) {
    console.error('Error fetching client stats:', error);
    return {
      success: false,
      message: 'No se pudieron cargar las estadísticas de clientes.',
    };
  }
}
