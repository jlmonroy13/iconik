import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ServiceType } from '@/generated/prisma'
import { getUserIdFromRequest } from '@/lib/auth'
import { assertUserSpaAccess } from '@/lib/authz'

// Validation schemas
const createServiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  type: z.nativeEnum(ServiceType, {
    required_error: 'Service type is required'
  }),
  kitCost: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(1).optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().default(true),
  recommendedReturnDays: z.number().min(0).optional(),
  spaId: z.string().min(1, 'Spa ID is required'),
})

// GET /api/services - Get all services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const spaId = searchParams.get('spaId')
    const type = searchParams.get('type')
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

    if (type) {
      where.type = type
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const services = await prisma.service.findMany({
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
            appointmentServices: true,
            clientServiceHistory: true,
            serviceDurations: true,
          }
        }
      }
    })

    return NextResponse.json(services)
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createServiceSchema.parse(body)

    // Security check: verify user access to the spa
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, validatedData.spaId)

    const service = await prisma.service.create({
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

    return NextResponse.json(service, { status: 201 })
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

    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
