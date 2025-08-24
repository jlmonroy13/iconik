'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { auth } from '@/../../auth';

// Validation schema for creating/updating branches
const branchSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().min(1, 'El código es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  isMain: z.boolean().default(false),
});

export async function createBranch(spaId: string, formData: FormData) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Parse and validate form data
    const rawData = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      address: formData.get('address') as string,
      isMain: formData.get('isMain') === 'true',
    };

    const validatedData = branchSchema.parse(rawData);

    // Verify spa exists
    const spa = await prisma.spa.findUnique({
      where: { id: spaId },
    });

    if (!spa) {
      throw new Error('Spa no encontrado');
    }

    // Check if code already exists in this spa
    const existingBranch = await prisma.branch.findFirst({
      where: {
        code: validatedData.code,
        spaId: spaId,
      },
    });

    if (existingBranch) {
      throw new Error('El código ya existe en este spa');
    }

    // If this is the main branch, unset other main branches
    if (validatedData.isMain) {
      await prisma.branch.updateMany({
        where: {
          spaId: spaId,
          isMain: true,
        },
        data: {
          isMain: false,
        },
      });
    }

    // Create branch
    const branch = await prisma.branch.create({
      data: {
        ...validatedData,
        spaId: spaId,
      },
    });

    revalidatePath(`/dashboard/super-admin/spa/${spaId}`);

    return { success: true, data: branch };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating branch:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear sede',
    };
  }
}

export async function updateBranch(branchId: string, formData: FormData) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Parse and validate form data
    const rawData = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      address: formData.get('address') as string,
      isMain: formData.get('isMain') === 'true',
    };

    const validatedData = branchSchema.parse(rawData);

    // Verify branch exists
    const existingBranch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { spa: true },
    });

    if (!existingBranch) {
      throw new Error('Sede no encontrada');
    }

    // Check if code already exists in this spa (excluding current branch)
    const codeExists = await prisma.branch.findFirst({
      where: {
        code: validatedData.code,
        spaId: existingBranch.spaId,
        id: { not: branchId },
      },
    });

    if (codeExists) {
      throw new Error('El código ya existe en este spa');
    }

    // If this is the main branch, unset other main branches
    if (validatedData.isMain) {
      await prisma.branch.updateMany({
        where: {
          spaId: existingBranch.spaId,
          isMain: true,
          id: { not: branchId },
        },
        data: {
          isMain: false,
        },
      });
    }

    // Update branch
    const branch = await prisma.branch.update({
      where: { id: branchId },
      data: validatedData,
    });

    revalidatePath(`/dashboard/super-admin/spa/${existingBranch.spaId}`);

    return { success: true, data: branch };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating branch:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al actualizar sede',
    };
  }
}

export async function deleteBranch(branchId: string) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify branch exists and get spa info
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        spa: true,
        _count: {
          select: {
            clients: true,
            manicurists: true,
            appointments: true,
          },
        },
      },
    });

    if (!branch) {
      throw new Error('Sede no encontrada');
    }

    // Check if branch has any data
    if (
      branch._count.clients > 0 ||
      branch._count.manicurists > 0 ||
      branch._count.appointments > 0
    ) {
      throw new Error(
        'No se puede eliminar una sede que tiene clientes, manicuristas o citas asociados'
      );
    }

    // Delete branch
    await prisma.branch.delete({
      where: { id: branchId },
    });

    revalidatePath(`/dashboard/super-admin/spa/${branch.spaId}`);

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting branch:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al eliminar sede',
    };
  }
}
