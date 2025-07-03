import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getUserIdFromRequest } from '@/lib/auth'

// Validation schemas
const createSpaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email'),
  website: z.string().url().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  timezone: z.string().default('America/Mexico_City'),
  currency: z.string().default('MXN'),
  taxRate: z.number().min(0).max(1).default(0.16),
})

// GET /api/spas - Get all spas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    // Get authenticated user
    const userId = await getUserIdFromRequest()

    // Get user's spa access
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { spaId: true }
    })

    if (!user || !user.spaId) {
      return NextResponse.json(
        { error: 'User not associated with any spa' },
        { status: 403 }
      )
    }

    const where: Record<string, unknown> = {
      id: user.spaId // Only show user's spa
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const spas = await prisma.spa.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json(spas)
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching spas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spas' },
      { status: 500 }
    )
  }
}

// POST /api/spas - Create a new spa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createSpaSchema.parse(body)

    // Get authenticated user
    const userId = await getUserIdFromRequest()

    // Check if user already has a spa (one user per spa model)
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { spaId: true }
    })

    if (existingUser && existingUser.spaId) {
      return NextResponse.json(
        { error: 'User already associated with a spa' },
        { status: 400 }
      )
    }

    const spa = await prisma.spa.create({
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

    // Associate the user with the created spa
    await prisma.user.update({
      where: { id: userId },
      data: { spaId: spa.id }
    })

    return NextResponse.json(spa, { status: 201 })
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

    console.error('Error creating spa:', error)
    return NextResponse.json(
      { error: 'Failed to create spa' },
      { status: 500 }
    )
  }
}
