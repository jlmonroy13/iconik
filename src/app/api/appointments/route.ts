import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { AppointmentStatus } from '@/generated/prisma'
import { getUserIdFromRequest } from '@/lib/auth'
import { assertUserSpaAccess } from '@/lib/authz'

// Validation schemas
const createAppointmentSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  manicuristId: z.string().optional(),
  isScheduled: z.boolean().default(true),
  scheduledAt: z.string().min(1, 'Scheduled date is required'), // ISO date string
  status: z.nativeEnum(AppointmentStatus).default('SCHEDULED'),
  notes: z.string().optional(),
  bookingLinkId: z.string().optional(),
  requiresApproval: z.boolean().default(false),
  requiresPreConfirmation: z.boolean().default(false),
  spaId: z.string().min(1, 'Spa ID is required'),
  services: z.array(z.object({
    serviceId: z.string().min(1, 'Service ID is required'),
    manicuristId: z.string().min(1, 'Manicurist ID is required'),
    price: z.number().min(0, 'Price must be positive'),
    kitCost: z.number().min(0).optional(),
    taxRate: z.number().min(0).max(1).optional(),
  })).min(1, 'At least one service is required'),
})

// GET /api/appointments - Get all appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const spaId = searchParams.get('spaId')
    const clientId = searchParams.get('clientId')
    const manicuristId = searchParams.get('manicuristId')
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const isScheduled = searchParams.get('isScheduled')

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

    if (clientId) {
      where.clientId = clientId
    }

    if (manicuristId) {
      where.manicuristId = manicuristId
    }

    if (status) {
      where.status = status
    }

    if (isScheduled !== null) {
      where.isScheduled = isScheduled === 'true'
    }

    if (dateFrom || dateTo) {
      const dateFilter: Record<string, unknown> = {}
      if (dateFrom) {
        dateFilter.gte = new Date(dateFrom)
      }
      if (dateTo) {
        dateFilter.lte = new Date(dateTo)
      }
      where.scheduledAt = dateFilter
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
      include: {
        spa: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          }
        },
        manicurist: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          }
        },
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                type: true,
                duration: true,
              }
            },
            manicurist: {
              select: {
                id: true,
                name: true,
              }
            },
          }
        },
        _count: {
          select: {
            services: true,
            payments: true,
            approvalHistory: true,
            preConfirmationReminders: true,
          }
        }
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    const err = error as Error;
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createAppointmentSchema.parse(body)

    // Security check: verify user access to the spa
    const userId = await getUserIdFromRequest()
    await assertUserSpaAccess(userId, validatedData.spaId)

    // Parse scheduled date
    const data = {
      ...validatedData,
      scheduledAt: new Date(validatedData.scheduledAt),
      services: undefined, // Remove services from main data
    }

    // Create appointment with services in a transaction
    const appointment = await prisma.$transaction(async (tx) => {
      const newAppointment = await tx.appointment.create({
        data,
        include: {
          spa: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          },
          client: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            }
          },
          manicurist: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            }
          },
          services: {
            include: {
              service: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  duration: true,
                }
              },
              manicurist: {
                select: {
                  id: true,
                  name: true,
                }
              },
            }
          },
          _count: {
            select: {
              services: true,
              payments: true,
              approvalHistory: true,
              preConfirmationReminders: true,
            }
          }
        }
      })

      // Create appointment services
      for (const serviceData of validatedData.services) {
        await tx.appointmentService.create({
          data: {
            appointmentId: newAppointment.id,
            serviceId: serviceData.serviceId,
            manicuristId: serviceData.manicuristId,
            price: serviceData.price,
            kitCost: serviceData.kitCost,
            taxRate: serviceData.taxRate,
            estimatedDuration: 0, // Will be set from service.duration
          }
        })
      }

      // Return the appointment with services
      return tx.appointment.findUnique({
        where: { id: newAppointment.id },
        include: {
          spa: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          },
          client: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            }
          },
          manicurist: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            }
          },
          services: {
            include: {
              service: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  duration: true,
                }
              },
              manicurist: {
                select: {
                  id: true,
                  name: true,
                }
              },
            }
          },
          _count: {
            select: {
              services: true,
              payments: true,
              approvalHistory: true,
              preConfirmationReminders: true,
            }
          }
        }
      })
    })

    return NextResponse.json(appointment, { status: 201 })
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

    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
