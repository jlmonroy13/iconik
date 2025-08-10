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

  console.log('🌱 Creando datos iniciales...')

  // Crear un usuario super admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'jlmonroy13@gmail.com',
      name: 'Super Administrador',
      role: 'SUPER_ADMIN',
      isSuperAdmin: true,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Usuario super admin creado:', superAdmin.email)

  // Crear un spa de ejemplo
  const spa = await prisma.spa.create({
    data: {
      name: 'Spa de Ejemplo',
      slug: 'spa-ejemplo',
      address: 'Calle Principal 123',
      phone: '+1234567890',
      email: 'info@spaejemplo.com',
      openingTime: '09:00',
      closingTime: '18:00',
    },
  })

  console.log('✅ Spa de ejemplo creado:', spa.name)

  // Crear un usuario admin para el spa
  const spaAdmin = await prisma.user.create({
    data: {
      email: 'spa@iconik.com',
      name: 'Administrador del Spa',
      role: 'ADMIN',
      emailVerified: new Date(),
      spaId: spa.id,
    },
  })

  console.log('✅ Usuario admin del spa creado:', spaAdmin.email)

  console.log('🎉 Datos iniciales creados exitosamente!')
}

main().finally(() => prisma.$disconnect())
