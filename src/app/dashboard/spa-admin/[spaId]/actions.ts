'use server';

import { auth } from '@/../../auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createBranchSchema, createUserSchema } from '@/types/forms';

// Validation schema for creating branch
const createBranchSchemaSpaAdmin = createBranchSchema.extend({
  spaId: z.string().min(1, 'El spa es requerido'),
});

// Validation schema for creating users (BRANCH_ADMIN and MANICURIST)
const createUserSchemaSpaAdmin = createUserSchema.extend({
  role: z.enum(['BRANCH_ADMIN', 'MANICURIST']),
});

export async function createBranch(
  spaId: string,
  data: Record<string, unknown>
) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SPA_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      throw new Error('No tienes acceso a este spa');
    }

    // Parse and validate form data
    const rawData = {
      ...data,
      spaId: spaId,
    };

    const validatedData = createBranchSchemaSpaAdmin.parse(rawData);

    // Check if code already exists in this spa
    const existingBranch = await prisma.branch.findFirst({
      where: {
        code: validatedData.code,
        spaId: spaId,
      },
    });

    if (existingBranch) {
      throw new Error('El código ya está en uso por otra sede en este spa');
    }

    // Create branch
    const branch = await prisma.branch.create({
      data: {
        ...validatedData,
        // Convert empty strings to null for optional fields
        description: validatedData.description || null,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        openingTime: validatedData.openingTime || null,
        closingTime: validatedData.closingTime || null,
        invoicePrefix: validatedData.invoicePrefix || null,
      },
    });

    revalidatePath(`/dashboard/spa-admin/${spaId}`);

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

export async function updateBranch(
  branchId: string,
  data: Record<string, unknown>
) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SPA_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify branch exists and get spaId
    const existingBranch = await prisma.branch.findFirst({
      where: {
        id: branchId,
      },
    });

    if (!existingBranch) {
      throw new Error('Sede no encontrada');
    }

    const spaId = existingBranch.spaId;

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      throw new Error('No tienes acceso a este spa');
    }

    // Parse and validate form data
    const rawData = {
      ...data,
      spaId: spaId,
    };

    const validatedData = createBranchSchemaSpaAdmin.parse(rawData);

    // Check if code already exists in this spa (excluding current branch)
    const codeExists = await prisma.branch.findFirst({
      where: {
        code: validatedData.code,
        spaId: spaId,
        id: { not: branchId },
      },
    });

    if (codeExists) {
      throw new Error('El código ya está en uso por otra sede en este spa');
    }

    // Update branch
    const branch = await prisma.branch.update({
      where: { id: branchId },
      data: {
        ...validatedData,
        // Convert empty strings to null for optional fields
        description: validatedData.description || null,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        openingTime: validatedData.openingTime || null,
        closingTime: validatedData.closingTime || null,
        invoicePrefix: validatedData.invoicePrefix || null,
      },
    });

    revalidatePath(`/dashboard/spa-admin/${spaId}`);

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

export async function deleteBranch(branchId: string, spaId: string) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SPA_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      throw new Error('No tienes acceso a este spa');
    }

    // Verify branch exists and belongs to this spa
    const branch = await prisma.branch.findFirst({
      where: {
        id: branchId,
        spaId: spaId,
      },
      include: {
        _count: {
          select: {
            clients: true,
            manicurists: true,
            appointments: true,
            users: true,
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
      branch._count.appointments > 0 ||
      branch._count.users > 0
    ) {
      throw new Error(
        'No se puede eliminar una sede que tiene clientes, manicuristas, citas o usuarios asociados'
      );
    }

    // Delete branch
    await prisma.branch.delete({
      where: { id: branchId },
    });

    revalidatePath(`/dashboard/spa-admin/${spaId}`);

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

export async function createUser(spaId: string, data: Record<string, unknown>) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SPA_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      throw new Error('No tienes acceso a este spa');
    }

    // Parse and validate form data
    const rawData = {
      ...data,
      spaId: spaId,
    };

    const validatedData = createUserSchemaSpaAdmin.parse(rawData);

    // Verify branch exists if provided
    if (validatedData.branchId) {
      const branch = await prisma.branch.findFirst({
        where: {
          id: validatedData.branchId,
          spaId: spaId,
        },
      });

      if (!branch) {
        throw new Error('Sede no encontrada');
      }
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
        spaId: validatedData.spaId,
        branchId: validatedData.branchId || null,
        isActive: validatedData.isActive,
        emailVerified: new Date(), // Auto-verify for admin-created users
      },
    });

    revalidatePath(`/dashboard/spa-admin/${spaId}`);

    return { success: true, data: user };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear usuario',
    };
  }
}

export async function updateUser(
  userId: string,
  data: Record<string, unknown>
) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SPA_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify user exists and get spaId
    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        role: { in: ['BRANCH_ADMIN', 'MANICURIST'] },
      },
    });

    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }

    const spaId = existingUser.spaId!;

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      throw new Error('No tienes acceso a este spa');
    }

    // Parse and validate form data
    const rawData = {
      ...data,
      spaId: spaId,
    };

    const validatedData = createUserSchemaSpaAdmin.parse(rawData);

    // Verify branch exists if provided
    if (validatedData.branchId) {
      const branch = await prisma.branch.findFirst({
        where: {
          id: validatedData.branchId,
          spaId: spaId,
        },
      });

      if (!branch) {
        throw new Error('Sede no encontrada');
      }
    }

    // Check if email already exists (excluding current user)
    const emailExists = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
        id: { not: userId },
      },
    });

    if (emailExists) {
      throw new Error('El email ya está registrado por otro usuario');
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
        branchId: validatedData.branchId || null,
        isActive: validatedData.isActive,
      },
    });

    revalidatePath(`/dashboard/spa-admin/${spaId}`);

    return { success: true, data: user };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating user:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al actualizar usuario',
    };
  }
}

export async function deleteUser(userId: string, spaId: string) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SPA_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify user has access to this spa
    if (session.user.spaId !== spaId) {
      throw new Error('No tienes acceso a este spa');
    }

    // Verify user exists and belongs to this spa
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        spaId: spaId,
        role: { in: ['BRANCH_ADMIN', 'MANICURIST'] },
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath(`/dashboard/spa-admin/${spaId}`);

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting user:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al eliminar usuario',
    };
  }
}
