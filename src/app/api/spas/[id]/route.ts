import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getUserIdFromRequest } from '@/lib/auth'
import { assertUserSpaAccess } from '@/lib/authz'

// Validation schema for updates
const updateSpaSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  slug: z.string().min(1, 'Slug is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  phone: z.string().min(1, 'Phone is required').optional(),
  email: z.string().email('Invalid email').optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  taxRate: z.number().min(0).max(1).optional(),
})

function getSpaIdFromRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const spaId = searchParams.get('spaId')
  if (!spaId) {
    throw new Error('spaId is required')
  }
  return spaId
}

// GET /api/spas/[id] - Get a specific spa
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    const spa = await prisma.spa.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            services: true,
            manicurists: true,
            clients: true,
            appointments: true,
          }
        }
      }
    })

    if (!spa) {
      return NextResponse.json(
        { error: 'Spa not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(spa)
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching spa:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spa' },
      { status: 500 }
    )
  }
}

// PUT /api/spas/[id] - Update a spa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    const body = await request.json()
    const validatedData = updateSpaSchema.parse(body)

    const spa = await prisma.spa.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        _count: {
          select: {
            services: true,
            manicurists: true,
            clients: true,
            appointments: true,
          }
        }
      }
    })

    return NextResponse.json(spa)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (err instanceof Error && err.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Spa not found' },
        { status: 404 }
      )
    }
    console.error('Error updating spa:', error)
    return NextResponse.json(
      { error: 'Failed to update spa' },
      { status: 500 }
    )
  }
}

// DELETE /api/spas/[id] - Delete a spa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    // Check if spa has related data
    const spaWithCounts = await prisma.spa.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            services: true,
            manicurists: true,
            clients: true,
            appointments: true,
          }
        }
      }
    })

    if (!spaWithCounts) {
      return NextResponse.json(
        { error: 'Spa not found' },
        { status: 404 }
      )
    }

    // Check if spa has related data
    const hasRelatedData = Object.values(spaWithCounts._count).some(count => count > 0)

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error: 'Cannot delete spa with related data',
          details: {
            services: spaWithCounts._count.services,
            manicurists: spaWithCounts._count.manicurists,
            clients: spaWithCounts._count.clients,
            appointments: spaWithCounts._count.appointments,
          }
        },
        { status: 400 }
      )
    }

    await prisma.spa.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Spa deleted successfully' })
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error deleting spa:', error)
    return NextResponse.json(
      { error: 'Failed to delete spa' },
      { status: 500 }
    )
  }
}
