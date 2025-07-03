import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { hash } from 'bcryptjs'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  spaName: z.string().min(1, 'Spa name is required'),
  spaSlug: z.string().min(1, 'Spa slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase, no spaces'),
  spaPhone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, spaName, spaSlug, spaPhone } = registerSchema.parse(body)

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    // Check if spa slug already exists
    const existingSpa = await prisma.spa.findUnique({ where: { slug: spaSlug } })
    if (existingSpa) {
      return NextResponse.json({ error: 'Spa slug already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create spa and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const spa = await tx.spa.create({
        data: {
          name: spaName,
          slug: spaSlug,
          phone: spaPhone,
        }
      })
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          spaId: spa.id,
          role: 'ADMIN',
        },
        select: { id: true, name: true, email: true, spaId: true, role: true }
      })
      return { user, spa }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
