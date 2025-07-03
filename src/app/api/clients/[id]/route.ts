import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getUserIdFromRequest } from '@/lib/auth'
import { assertUserSpaAccess } from '@/lib/authz'

// Validation schema for updates
const updateClientSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(1, 'Phone is required').optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(), // ISO date string
  notes: z.string().optional(),
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

// GET /api/clients/[id] - Get a specific client
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    const client = await prisma.client.findUnique({
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
            clientServiceHistory: true,
          }
        }
      }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(client)
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

// PUT /api/clients/[id] - Update a client
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    const body = await request.json()
    const validatedData = updateClientSchema.parse(body)

    // Parse date of birth if provided
    const data = {
      ...validatedData,
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
    }

    const client = await prisma.client.update({
      where: { id: params.id, spaId },
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

    return NextResponse.json(client)
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
        { error: 'Client not found' },
        { status: 404 }
      )
    }
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    )
  }
}

// DELETE /api/clients/[id] - Delete a client
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spaId = getSpaIdFromRequest(request)
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, spaId)
    // Check if client has related data
    const clientWithCounts = await prisma.client.findUnique({
      where: { id: params.id, spaId },
      include: {
        _count: {
          select: {
            appointments: true,
            clientServiceHistory: true,
          }
        }
      }
    })

    if (!clientWithCounts) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    // Check if client has related data
    const hasRelatedData = Object.values(clientWithCounts._count).some(count => count > 0)

    if (hasRelatedData) {
      return NextResponse.json(
        {
          error: 'Cannot delete client with related data',
          details: {
            appointments: clientWithCounts._count.appointments,
            clientServiceHistory: clientWithCounts._count.clientServiceHistory,
          }
        },
        { status: 400 }
      )
    }

    await prisma.client.delete({
      where: { id: params.id, spaId }
    })

    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { error: 'Failed to delete client' },
      { status: 500 }
    )
  }
}
