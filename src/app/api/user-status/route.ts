import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest()

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isSuperAdmin: true,
        spaId: true,
        spa: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user,
      hasSpa: !!user.spaId,
      spaActive: user.spa?.isActive || false
    })
  } catch (error) {
    console.error('User status error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 401 })
  }
}
