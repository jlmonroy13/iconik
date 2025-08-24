'use server';

import { auth } from '@/../../auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  role: z.enum(['SPA_ADMIN', 'BRANCH_ADMIN', 'MANICURIST', 'CLIENT']),
  branchId: z.string().optional(),
  isActive: z.boolean().default(true),
});

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  role: z.enum(['SPA_ADMIN', 'BRANCH_ADMIN', 'MANICURIST', 'CLIENT']),
  branchId: z.string().optional(),
  isActive: z.boolean(),
});

export async function createUser(spaId: string, formData: FormData) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Validate spa exists
    const spa = await prisma.spa.findUnique({
      where: { id: spaId },
      include: { branches: true },
    });

    if (!spa) {
      throw new Error('Spa no encontrado');
    }

    // Parse and validate form data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      branchId: (formData.get('branchId') as string) || undefined,
      isActive: formData.get('isActive') === 'true',
    };

    const validatedData = createUserSchema.parse(rawData);

    // Validate branch if provided
    if (validatedData.branchId) {
      const branch = spa.branches.find(b => b.id === validatedData.branchId);
      if (!branch) {
        throw new Error('Sede no válida para este spa');
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
        ...validatedData,
        spaId,
        emailVerified: new Date(), // Auto-verify for admin-created users
      },
    });

    revalidatePath(`/dashboard/super-admin/spa/${spaId}`);

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

export async function updateUser(spaId: string, formData: FormData) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Validate spa exists
    const spa = await prisma.spa.findUnique({
      where: { id: spaId },
      include: { branches: true },
    });

    if (!spa) {
      throw new Error('Spa no encontrado');
    }

    // Parse and validate form data
    const rawData = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      branchId: (formData.get('branchId') as string) || undefined,
      isActive: formData.get('isActive') === 'true',
    };

    const validatedData = updateUserSchema.parse(rawData);

    // Verify user exists and belongs to this spa
    const existingUser = await prisma.user.findFirst({
      where: {
        id: validatedData.id,
        spaId,
      },
    });

    if (!existingUser) {
      throw new Error('Usuario no encontrado');
    }

    // Validate branch if provided
    if (validatedData.branchId) {
      const branch = spa.branches.find(b => b.id === validatedData.branchId);
      if (!branch) {
        throw new Error('Sede no válida para este spa');
      }
    }

    // Check if email already exists (excluding current user)
    const emailExists = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
        id: { not: validatedData.id },
      },
    });

    if (emailExists) {
      throw new Error('El email ya está registrado por otro usuario');
    }

    // Update user
    const user = await prisma.user.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
        branchId: validatedData.branchId,
        isActive: validatedData.isActive,
      },
    });

    revalidatePath(`/dashboard/super-admin/spa/${spaId}`);

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

export async function deleteUser(spaId: string, userId: string) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify user exists and belongs to this spa
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        spaId,
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Prevent deleting super admin
    if (user.isSuperAdmin) {
      throw new Error('No se puede eliminar un super administrador');
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath(`/dashboard/super-admin/spa/${spaId}`);

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
