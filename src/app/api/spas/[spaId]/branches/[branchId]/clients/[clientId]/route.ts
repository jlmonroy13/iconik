import { NextRequest, NextResponse } from 'next/server';
import { requireBranchAccess } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { updateClientSchema } from '@/types/forms';

export async function PUT(
  request: NextRequest,
  { params }: { params: { spaId: string; branchId: string; clientId: string } }
) {
  try {
    const { spaId, branchId, clientId } = params;

    // Require BRANCH_ADMIN role and branch access
    await requireBranchAccess(spaId, branchId);

    // Verify client exists and belongs to this branch/spa
    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, spaId: true, branchId: true },
    });

    if (!existingClient) {
      return NextResponse.json(
        { message: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    if (existingClient.spaId !== spaId) {
      return NextResponse.json(
        { message: 'No tienes permisos para editar este cliente' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateClientSchema.parse({
      ...body,
      id: clientId,
    });

    // Check if another client with same document already exists in this spa
    const duplicateClient = await prisma.client.findFirst({
      where: {
        spaId,
        documentType: validatedData.documentType,
        documentNumber: validatedData.documentNumber,
        id: { not: clientId },
      },
    });

    if (duplicateClient) {
      return NextResponse.json(
        { message: 'Ya existe otro cliente con este documento en el spa' },
        { status: 409 }
      );
    }

    // Update client
    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        ...validatedData,
        birthday: validatedData.birthday
          ? new Date(validatedData.birthday)
          : null,
      },
      select: {
        id: true,
        name: true,
        documentType: true,
        documentNumber: true,
        phone: true,
        email: true,
        birthday: true,
        notes: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Cliente actualizado exitosamente',
        client,
      },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating client:', error);

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
  { params }: { params: { spaId: string; branchId: string; clientId: string } }
) {
  try {
    const { spaId, branchId, clientId } = params;

    // Require BRANCH_ADMIN role and branch access
    await requireBranchAccess(spaId, branchId);

    // Verify client exists and belongs to this branch/spa
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        name: true,
        spaId: true,
        branchId: true,
        _count: {
          select: {
            appointments: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { message: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    if (client.spaId !== spaId) {
      return NextResponse.json(
        { message: 'No tienes permisos para eliminar este cliente' },
        { status: 403 }
      );
    }

    // Check if client has appointments
    if (client._count.appointments > 0) {
      return NextResponse.json(
        {
          message:
            'No se puede eliminar un cliente que tiene citas registradas',
        },
        { status: 400 }
      );
    }

    // Delete client
    await prisma.client.delete({
      where: { id: clientId },
    });

    return NextResponse.json(
      { message: 'Cliente eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting client:', error);

    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
