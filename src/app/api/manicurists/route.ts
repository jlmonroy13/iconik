import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getUserIdFromRequest } from '@/lib/auth'
import { assertUserSpaAccess } from '@/lib/authz'

// Validation schemas
const createManicuristSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(1, 'Phone is required'),
  specialty: z.string().optional(),
  commission: z.number().min(0).max(1).default(0.5),
  isActive: z.boolean().default(true),
  spaId: z.string().min(1, 'Spa ID is required'),
})

// GET /api/manicurists - Get all manicurists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const spaId = searchParams.get('spaId')
    const specialty = searchParams.get('specialty')
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    // Security check: require spaId and verify user access
    if (!spaId) {
      return NextResponse.json(
        { error: 'spaId is required' },
        { status: 400 }
      )
    }

    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)

    const where: Record<string, unknown> = {}

    if (spaId) {
      where.spaId = spaId
    }

    if (specialty) {
      where.specialty = specialty
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { specialty: { contains: search, mode: 'insensitive' } },
      ]
    }

    const manicurists = await prisma.manicurist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json(manicurists)
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching manicurists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch manicurists' },
      { status: 500 }
    )
  }
}

// POST /api/manicurists - Create a new manicurist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createManicuristSchema.parse(body)

    // Security check: verify user access to the spa
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, validatedData.spaId)

    const manicurist = await prisma.manicurist.create({
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

    return NextResponse.json(manicurist, { status: 201 })
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

    console.error('Error creating manicurist:', error)
    return NextResponse.json(
      { error: 'Failed to create manicurist' },
      { status: 500 }
    )
  }
}
