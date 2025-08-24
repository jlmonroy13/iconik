'use server';

import { auth } from '@/../../auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schema for creating spa
const createSpaSchema = z.object({
  name: z.string().min(1, 'El nombre del spa es requerido'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(
      /^[a-z0-9-]+$/,
      'El slug solo puede contener letras minúsculas, números y guiones'
    ),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  openingTime: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Formato de hora inválido (HH:MM)'
    )
    .optional()
    .or(z.literal('')),
  closingTime: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Formato de hora inválido (HH:MM)'
    )
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().default(true),
});

// Validation schema for creating admin users (SPA_ADMIN and SUPER_ADMIN)
const createAdminSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  role: z.enum(['SPA_ADMIN', 'SUPER_ADMIN']),
  spaId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export async function createSpa(formData: FormData) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Parse and validate form data
    const rawData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      address: (formData.get('address') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      openingTime: (formData.get('openingTime') as string) || undefined,
      closingTime: (formData.get('closingTime') as string) || undefined,
      isActive: formData.get('isActive') === 'true',
    };

    const validatedData = createSpaSchema.parse(rawData);

    // Check if slug already exists
    const existingSpa = await prisma.spa.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingSpa) {
      throw new Error('El slug ya está en uso por otro spa');
    }

    // Create spa
    const spa = await prisma.spa.create({
      data: {
        ...validatedData,
        // Convert empty strings to null for optional fields
        address: validatedData.address || null,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        openingTime: validatedData.openingTime || null,
        closingTime: validatedData.closingTime || null,
      },
    });

    revalidatePath('/dashboard/super-admin');

    return { success: true, data: spa };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating spa:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear spa',
    };
  }
}

export async function updateSpa(spaId: string, formData: FormData) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify spa exists
    const existingSpa = await prisma.spa.findUnique({
      where: { id: spaId },
    });

    if (!existingSpa) {
      throw new Error('Spa no encontrado');
    }

    // Parse and validate form data
    const rawData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      address: (formData.get('address') as string) || undefined,
      phone: (formData.get('phone') as string) || undefined,
      email: (formData.get('email') as string) || undefined,
      openingTime: (formData.get('openingTime') as string) || undefined,
      closingTime: (formData.get('closingTime') as string) || undefined,
      isActive: formData.get('isActive') === 'true',
    };

    const validatedData = createSpaSchema.parse(rawData);

    // Check if slug already exists (excluding current spa)
    const slugExists = await prisma.spa.findFirst({
      where: {
        slug: validatedData.slug,
        id: { not: spaId },
      },
    });

    if (slugExists) {
      throw new Error('El slug ya está en uso por otro spa');
    }

    // Update spa
    const spa = await prisma.spa.update({
      where: { id: spaId },
      data: {
        ...validatedData,
        // Convert empty strings to null for optional fields
        address: validatedData.address || null,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        openingTime: validatedData.openingTime || null,
        closingTime: validatedData.closingTime || null,
      },
    });

    revalidatePath('/dashboard/super-admin');
    revalidatePath(`/dashboard/super-admin/spa/${spaId}`);

    return { success: true, data: spa };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating spa:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar spa',
    };
  }
}

export async function deleteSpa(spaId: string) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify spa exists
    const spa = await prisma.spa.findUnique({
      where: { id: spaId },
      include: {
        _count: {
          select: {
            users: true,
            branches: true,
            clients: true,
            services: true,
          },
        },
      },
    });

    if (!spa) {
      throw new Error('Spa no encontrado');
    }

    // Check if spa has any data
    if (
      spa._count.users > 0 ||
      spa._count.branches > 0 ||
      spa._count.clients > 0 ||
      spa._count.services > 0
    ) {
      throw new Error(
        'No se puede eliminar un spa que tiene usuarios, sedes, clientes o servicios asociados'
      );
    }

    // Delete spa
    await prisma.spa.delete({
      where: { id: spaId },
    });

    revalidatePath('/dashboard/super-admin');

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting spa:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al eliminar spa',
    };
  }
}

export async function createAdmin(formData: FormData) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Parse and validate form data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      spaId: (formData.get('spaId') as string) || undefined,
      isActive: formData.get('isActive') === 'true',
    };

    const validatedData = createAdminSchema.parse(rawData);

    // Verify spa exists if SPA_ADMIN
    if (validatedData.role === 'SPA_ADMIN' && validatedData.spaId) {
      const spa = await prisma.spa.findUnique({
        where: { id: validatedData.spaId },
      });

      if (!spa) {
        throw new Error('Spa no encontrado');
      }
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Create admin user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
        spaId: validatedData.role === 'SPA_ADMIN' ? validatedData.spaId : null,
        isActive: validatedData.isActive,
        emailVerified: new Date(), // Auto-verify for admin-created users
      },
    });

    revalidatePath('/dashboard/super-admin');

    return { success: true, data: user };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating admin:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al crear administrador',
    };
  }
}

export async function updateAdmin(userId: string, formData: FormData) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Parse and validate form data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      spaId: (formData.get('spaId') as string) || undefined,
      isActive: formData.get('isActive') === 'true',
    };

    const validatedData = createAdminSchema.parse(rawData);

    // Verify user exists and is admin
    const existingUser = await prisma.user.findFirst({
      where: {
        id: userId,
        role: { in: ['SPA_ADMIN', 'SUPER_ADMIN'] },
      },
    });

    if (!existingUser) {
      throw new Error('Administrador no encontrado');
    }

    // Verify spa exists if SPA_ADMIN
    if (validatedData.role === 'SPA_ADMIN' && validatedData.spaId) {
      const spa = await prisma.spa.findUnique({
        where: { id: validatedData.spaId },
      });

      if (!spa) {
        throw new Error('Spa no encontrado');
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
        spaId: validatedData.role === 'SPA_ADMIN' ? validatedData.spaId : null,
        isActive: validatedData.isActive,
      },
    });

    revalidatePath('/dashboard/super-admin');

    return { success: true, data: user };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating admin:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al actualizar administrador',
    };
  }
}

export async function deleteAdmin(userId: string) {
  try {
    // Verify authentication and permissions
    const session = await auth();
    if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
      throw new Error('No autorizado');
    }

    // Verify user exists and is admin
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        role: { in: ['SPA_ADMIN', 'SUPER_ADMIN'] },
      },
    });

    if (!user) {
      throw new Error('Administrador no encontrado');
    }

    // Prevent deleting super admin
    if (user.isSuperAdmin) {
      throw new Error('No se puede eliminar un super administrador');
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/dashboard/super-admin');

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting admin:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Error al eliminar administrador',
    };
  }
}
