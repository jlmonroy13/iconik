import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest()
    return NextResponse.json({
      success: true,
      userId,
      message: 'Authentication working'
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 401 })
  }
}
