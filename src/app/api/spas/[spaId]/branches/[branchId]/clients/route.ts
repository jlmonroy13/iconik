import { NextRequest, NextResponse } from 'next/server';
import { requireBranchAccess } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { createClientSchema } from '@/types/forms';

export async function POST(
  request: NextRequest,
  { params }: { params: { spaId: string; branchId: string } }
) {
  try {
    const { spaId, branchId } = params;

    // Require BRANCH_ADMIN role and branch access
    await requireBranchAccess(spaId, branchId);

    // Verify branch exists and belongs to spa
    const branch = await prisma.branch.findUnique({
      where: { id: branchId, spaId },
      select: { id: true, name: true },
    });

    if (!branch) {
      return NextResponse.json(
        { message: 'Sede no encontrada' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createClientSchema.parse(body);

    // Check if client with same document already exists in this spa
    const existingClient = await prisma.client.findFirst({
      where: {
        spaId,
        documentType: validatedData.documentType,
        documentNumber: validatedData.documentNumber,
      },
    });

    if (existingClient) {
      return NextResponse.json(
        { message: 'Ya existe un cliente con este documento en el spa' },
        { status: 409 }
      );
    }

    // Create client
    const client = await prisma.client.create({
      data: {
        ...validatedData,
        spaId,
        branchId,
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
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Cliente creado exitosamente',
        client,
      },
      { status: 201 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating client:', error);

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
