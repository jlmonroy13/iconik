import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getUserIdFromRequest } from '@/lib/auth'
import { assertUserSpaAccess } from '@/lib/authz'

// Validation schema for updates
const updateManicuristSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(1, 'Phone is required').optional(),
  specialty: z.string().optional(),
  commission: z.number().min(0).max(1).optional(),
  isActive: z.boolean().optional(),
})

function getSpaIdFromRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const spaId = searchParams.get('spaId')
  if (!spaId) {
    throw new Error('spaId is required')
  }
  return spaId
}

// GET /api/manicurists/[id] - Get a specific manicurist
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    const manicurist = await prisma.manicurist.findUnique({
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
            appointments: true,
            appointmentServices: true,
            commissions: true,
            schedules: true,
            availability: true,
            timeSlots: true,
            serviceDurations: true,
            salesGoals: true,
          }
        }
      }
    })

    if (!manicurist) {
      return NextResponse.json(
        { error: 'Manicurist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(manicurist)
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching manicurist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch manicurist' },
      { status: 500 }
    )
  }
}

// PUT /api/manicurists/[id] - Update a manicurist
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    const body = await request.json()
    const validatedData = updateManicuristSchema.parse(body)

    const manicurist = await prisma.manicurist.update({
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
            appointments: true,
            appointmentServices: true,
            commissions: true,
            schedules: true,
            availability: true,
            timeSlots: true,
            serviceDurations: true,
            salesGoals: true,
          }
        }
      }
    })

    return NextResponse.json(manicurist)
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
        { error: 'Manicurist not found' },
        { status: 404 }
      )
    }
    console.error('Error updating manicurist:', error)
    return NextResponse.json(
      { error: 'Failed to update manicurist' },
      { status: 500 }
    )
  }
}

// DELETE /api/manicurists/[id] - Delete a manicurist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    // Check if manicurist has related data
    const manicuristWithCounts = await prisma.manicurist.findUnique({
      where: { id: params.id, spaId },
      include: {
        _count: {
          select: {
            appointments: true,
            appointmentServices: true,
            commissions: true,
            schedules: true,
            availability: true,
            timeSlots: true,
            serviceDurations: true,
            salesGoals: true,
          }
        }
      }
    })

    if (!manicuristWithCounts) {
      return NextResponse.json(
        { error: 'Manicurist not found' },
        { status: 404 }
      )
    }

    // Check if manicurist has related data
    const hasRelatedData = Object.values(manicuristWithCounts._count).some(count => count > 0)

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error: 'Cannot delete manicurist with related data',
          details: {
            appointments: manicuristWithCounts._count.appointments,
            appointmentServices: manicuristWithCounts._count.appointmentServices,
            commissions: manicuristWithCounts._count.commissions,
            schedules: manicuristWithCounts._count.schedules,
            availability: manicuristWithCounts._count.availability,
            timeSlots: manicuristWithCounts._count.timeSlots,
            serviceDurations: manicuristWithCounts._count.serviceDurations,
            salesGoals: manicuristWithCounts._count.salesGoals,
          }
        },
        { status: 400 }
      )
    }

    await prisma.manicurist.delete({
      where: { id: params.id, spaId }
    })

    return NextResponse.json({ message: 'Manicurist deleted successfully' })
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error deleting manicurist:', error)
    return NextResponse.json(
      { error: 'Failed to delete manicurist' },
      { status: 500 }
    )
  }
}
