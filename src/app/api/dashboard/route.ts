import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma"

export async function POST(request: NextRequest) {
  // Parse request body
  const body = await request.json()
  const { spaName, spaSlug, spaEmail, adminName, adminEmail } = body

  // Get session and check super admin
  const session = await auth();
  const user = session?.user as { isSuperAdmin?: boolean }
  if (!user?.isSuperAdmin) {
    return NextResponse.json({ error: "Acceso denegado. Solo el super admin puede realizar esta acción." }, { status: 403 })
  }

  // Validate required fields
  if (!spaName || !spaSlug || !adminName || !adminEmail) {
    return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 })
  }

  try {
    // Create spa
    const spa = await prisma.spa.create({
      data: {
        name: spaName,
        slug: spaSlug,
        email: spaEmail || null,
      },
    })
    // Create admin user for the spa
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        role: "ADMIN",
        spaId: spa.id,
        isActive: true,
        isSuperAdmin: false,
      },
    })
    return NextResponse.json({ message: "Spa y administrador creados exitosamente." })
  } catch (error: unknown) {
    // Handle unique constraint error
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "El slug o el correo electrónico ya existen." }, { status: 409 })
    }
    return NextResponse.json({ error: "Error al crear el spa o el administrador." }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ mensaje: "Este endpoint solo acepta solicitudes POST para crear spas y administradores." }, { status: 200 })
}
