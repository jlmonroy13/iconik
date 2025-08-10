import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getUserIdFromRequest } from '@/lib/auth';
import { assertUserSpaAccess } from '@/lib/authz';

const paymentMethodSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  type: z.string().optional(),
  isActive: z.boolean().default(true),
  icon: z.string().optional(),
  transactionFee: z.number().min(0).max(1),
  spaId: z.string().min(1, 'El spaId es obligatorio'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spaId = searchParams.get('spaId');
    if (!spaId) {
      return NextResponse.json(
        { error: 'spaId es obligatorio' },
        { status: 400 }
      );
    }
    const userId = await getUserIdFromRequest();
    await assertUserSpaAccess(userId, spaId);
    const methods = await prisma.paymentMethod.findMany({
      where: { spaId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(methods);
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }
    console.error('Error al obtener métodos de pago:', error);
    return NextResponse.json(
      { error: 'Error al obtener métodos de pago' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = paymentMethodSchema.parse(body);
    const userId = await getUserIdFromRequest();
    await assertUserSpaAccess(userId, validated.spaId);
    const method = await prisma.paymentMethod.create({
      data: validated,
    });
    return NextResponse.json(method, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Error de validación', details: error.errors },
        { status: 400 }
      );
    }
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
    }
    console.error('Error al crear método de pago:', error);
    return NextResponse.json(
      { error: 'Error al crear método de pago' },
      { status: 500 }
    );
  }
}
