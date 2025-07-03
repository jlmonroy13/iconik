import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ServiceType } from '@/generated/prisma'
import { getUserIdFromRequest } from '@/lib/auth'
import { assertUserSpaAccess } from '@/lib/authz'

// Validation schema for updates
const updateServiceSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive').optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute').optional(),
  type: z.nativeEnum(ServiceType).optional(),
  kitCost: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(1).optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  recommendedReturnDays: z.number().min(0).optional(),
})

function getSpaIdFromRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const spaId = searchParams.get('spaId')
  if (!spaId) {
    throw new Error('spaId is required')
  }
  return spaId
}

// GET /api/services/[id] - Get a specific service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    const service = await prisma.service.findUnique({
      where: { id: params.id, spaId },
      include: {
        spa: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        _count: {
          select: {
            appointmentServices: true,
            clientServiceHistory: true,
            serviceDurations: true,
          }
        }
      }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(service)
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// PUT /api/services/[id] - Update a service
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    const body = await request.json()
    const validatedData = updateServiceSchema.parse(body)

    const service = await prisma.service.update({
      where: { id: params.id, spaId },
      data: validatedData,
      include: {
        spa: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        _count: {
          select: {
            appointmentServices: true,
            clientServiceHistory: true,
            serviceDurations: true,
          }
        }
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE /api/services/[id] - Delete a service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    // Check if service has related data
    const serviceWithCounts = await prisma.service.findUnique({
      where: { id: params.id, spaId },
      include: {
        _count: {
          select: {
            appointmentServices: true,
            clientServiceHistory: true,
            serviceDurations: true,
            salesGoals: true,
            bookingLinkServices: true,
          }
        }
      }
    })

    if (!serviceWithCounts) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if service has related data
    const hasRelatedData = Object.values(serviceWithCounts._count).some(count => count > 0)

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error: 'Cannot delete service with related data',
          details: {
            appointmentServices: serviceWithCounts._count.appointmentServices,
            clientServiceHistory: serviceWithCounts._count.clientServiceHistory,
            serviceDurations: serviceWithCounts._count.serviceDurations,
            salesGoals: serviceWithCounts._count.salesGoals,
            bookingLinkServices: serviceWithCounts._count.bookingLinkServices,
          }
        },
        { status: 400 }
      )
    }

    await prisma.service.delete({
      where: { id: params.id, spaId }
    })

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
