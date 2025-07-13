import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getUserIdFromRequest } from '@/lib/auth'
import { assertUserSpaAccess } from '@/lib/authz'

const updatePaymentMethodSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').optional(),
  type: z.string().optional(),
  isActive: z.boolean().optional(),
  icon: z.string().optional(),
  transactionFee: z.number().min(0).max(1).optional(),
})

function getSpaIdFromRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const spaId = searchParams.get('spaId')
  if (!spaId) throw new Error('spaId es obligatorio')
  return spaId
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    const body = await request.json()
    const validated = updatePaymentMethodSchema.parse(body)
    const method = await prisma.paymentMethod.update({
      where: { id: params.id, spaId },
      data: validated,
    })
    return NextResponse.json(method)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Error de validación', details: error.errors }, { status: 400 })
    }
    const err = error as Error
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 })
    }
    if (err instanceof Error && err.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Método de pago no encontrado' }, { status: 404 })
    }
    console.error('Error al actualizar método de pago:', error)
    return NextResponse.json({ error: 'Error al actualizar método de pago' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    // Verificar si tiene pagos asociados
    const methodWithPayments = await prisma.paymentMethod.findUnique({
      where: { id: params.id, spaId },
      include: { payments: true }
    })
    if (!methodWithPayments) {
      return NextResponse.json({ error: 'Método de pago no encontrado' }, { status: 404 })
    }
    if (methodWithPayments.payments.length > 0) {
      return NextResponse.json({ error: 'No se puede eliminar el método de pago porque tiene pagos asociados.' }, { status: 400 })
    }
    await prisma.paymentMethod.delete({ where: { id: params.id, spaId } })
    return NextResponse.json({ message: 'Método de pago eliminado correctamente' })
  } catch (error) {
    const err = error as Error
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Prohibido' }, { status: 403 })
    }
    console.error('Error al eliminar método de pago:', error)
    return NextResponse.json({ error: 'Error al eliminar método de pago' }, { status: 500 })
  }
}
