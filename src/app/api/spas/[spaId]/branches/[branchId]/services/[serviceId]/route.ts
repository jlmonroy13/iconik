import { NextRequest, NextResponse } from 'next/server';
import { requireBranchAccess } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { updateServiceSchema } from '@/types/forms';

export async function GET(
  request: NextRequest,
  { params }: { params: { spaId: string; branchId: string; serviceId: string } }
) {
  try {
    const { spaId, branchId, serviceId } = params;

    // Require BRANCH_ADMIN role and branch access
    await requireBranchAccess(spaId, branchId);

    // Get service
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { message: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    // Verify service belongs to this branch/spa
    if (service.spaId !== spaId || service.branchId !== branchId) {
      return NextResponse.json(
        { message: 'No tienes permisos para acceder a este servicio' },
        { status: 403 }
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching service:', error);

    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { spaId: string; branchId: string; serviceId: string } }
) {
  try {
    const { spaId, branchId, serviceId } = params;

    // Require BRANCH_ADMIN role and branch access
    await requireBranchAccess(spaId, branchId);

    // Verify service exists and belongs to this branch/spa
    const existingService = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
        spaId: true,
        branchId: true,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        { message: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    if (
      existingService.spaId !== spaId ||
      existingService.branchId !== branchId
    ) {
      return NextResponse.json(
        { message: 'No tienes permisos para modificar este servicio' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateServiceSchema.parse(body);

    // Check if name is being changed and if it conflicts with another service
    if (validatedData.name && validatedData.name !== existingService.name) {
      const conflictingService = await prisma.service.findFirst({
        where: {
          spaId,
          branchId,
          name: validatedData.name,
          id: { not: serviceId },
        },
      });

      if (conflictingService) {
        return NextResponse.json(
          { message: 'Ya existe un servicio con este nombre en la sede' },
          { status: 409 }
        );
      }
    }

    // Update service
    const service = await prisma.service.update({
      where: { id: serviceId },
      data: validatedData,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Servicio actualizado exitosamente',
        service,
      },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating service:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { spaId: string; branchId: string; serviceId: string } }
) {
  try {
    const { spaId, branchId, serviceId } = params;

    // Require BRANCH_ADMIN role and branch access
    await requireBranchAccess(spaId, branchId);

    // Verify service exists and belongs to this branch/spa
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
        spaId: true,
        branchId: true,
        _count: {
          select: {
            appointmentServices: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { message: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    if (service.spaId !== spaId || service.branchId !== branchId) {
      return NextResponse.json(
        { message: 'No tienes permisos para eliminar este servicio' },
        { status: 403 }
      );
    }

    // Check if service has appointments
    if (service._count.appointmentServices > 0) {
      return NextResponse.json(
        {
          message:
            'No se puede eliminar un servicio que tiene citas registradas',
        },
        { status: 400 }
      );
    }

    // Delete service
    await prisma.service.delete({
      where: { id: serviceId },
    });

    return NextResponse.json(
      { message: 'Servicio eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting service:', error);

    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
