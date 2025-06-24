import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Limpiando la base de datos de Iconik...')

  // Elimina todos los datos de todas las tablas relevantes
  await prisma.appointment.deleteMany()
  await prisma.service.deleteMany()
  await prisma.client.deleteMany()
  await prisma.manicurist.deleteMany()
  await prisma.user.deleteMany()
  await prisma.spa.deleteMany()

  console.log('✅ Base de datos vacía')
}

main().finally(() => prisma.$disconnect())
