import { NextRequest, NextResponse } from 'next/server';
import { requireBranchAccess } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { createServiceSchema } from '@/types/forms';
import { ServiceType } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ spaId: string; branchId: string }>;
  }
) {
  try {
    const { spaId, branchId } = await params;
    const { searchParams } = new URL(request.url);

    // Require BRANCH_ADMIN role and branch access
    await requireBranchAccess(spaId, branchId);

    // Get query parameters
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {
      spaId,
      branchId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(type && { type: type as ServiceType }),
    };

    // Fetch services with pagination
    const [services, totalCount] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      }),
      prisma.service.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      services,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching services:', error);

    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ spaId: string; branchId: string }>;
  }
) {
  try {
    const { spaId, branchId } = await params;

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
    const validatedData = createServiceSchema.parse(body);

    // Check if service with same name already exists in this branch
    const existingService = await prisma.service.findFirst({
      where: {
        spaId,
        branchId,
        name: validatedData.name,
      },
    });

    if (existingService) {
      return NextResponse.json(
        { message: 'Ya existe un servicio con este nombre en la sede' },
        { status: 409 }
      );
    }

    // Create service
    const service = await prisma.service.create({
      data: {
        ...validatedData,
        spaId,
        branchId,
      },
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
        message: 'Servicio creado exitosamente',
        service,
      },
      { status: 201 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating service:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
