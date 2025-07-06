import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getUserIdFromRequest } from '@/lib/auth'
import { assertUserSpaAccess } from '@/lib/authz'

// Validation schemas
const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  documentType: z.string().min(2, 'Document type is required'),
  documentNumber: z.string().min(5, 'Document number is required'),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(), // ISO date string
  notes: z.string().optional(),
  isActive: z.boolean().default(true),
  spaId: z.string().min(1, 'Spa ID is required'),
})

// GET /api/clients - Get all clients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const spaId = searchParams.get('spaId')
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

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const clients = await prisma.client.findMany({
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
            clientServiceHistory: true,
          }
        }
      }
    })

    return NextResponse.json(clients)
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createClientSchema.parse(body)

    // Security check: verify user access to the spa
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, validatedData.spaId)

    // Parse date of birth if provided
    const data = {
      ...validatedData,
      documentType: validatedData.documentType,
      documentNumber: validatedData.documentNumber,
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
    }

    const client = await prisma.client.create({
      data,
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
            clientServiceHistory: true,
          }
        }
      }
    })

    return NextResponse.json(client, { status: 201 })
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

    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
