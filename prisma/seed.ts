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
  await prisma.branch.deleteMany()
  await prisma.spa.deleteMany()

  console.log('✅ Base de datos vacía')

  console.log('🌱 Creando datos iniciales...')

  // Crear usuario SUPER_ADMIN
  const superAdmin = await prisma.user.create({
    data: {
      email: 'jlmonroy13@gmail.com',
      name: 'Super Administrador',
      role: 'SUPER_ADMIN',
      isSuperAdmin: true,
      emailVerified: new Date(),
    },
  })

  console.log('✅ Usuario SUPER_ADMIN creado:', superAdmin.email)

  // Crear Spa 1
  const spa1 = await prisma.spa.create({
    data: {
      name: 'Spa 1',
      slug: 'spa-1',
      address: 'Calle Principal 123',
      phone: '+1234567890',
      email: 'info@spa1.com',
      openingTime: '09:00',
      closingTime: '18:00',
    },
  })

  console.log('✅ Spa 1 creado:', spa1.name)

  // Crear usuario SPA_ADMIN para Spa 1
  const spa1Admin = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa1@gmail.com',
      name: 'Administrador Spa 1',
      role: 'SPA_ADMIN',
      emailVerified: new Date(),
      spaId: spa1.id,
    },
  })

  console.log('✅ Usuario SPA_ADMIN del Spa 1 creado:', spa1Admin.email)

  // Crear Sede 1 del Spa 1
  const spa1Branch1 = await prisma.branch.create({
    data: {
      name: 'Sede Principal Spa 1',
      code: 'SPA1_PRINCIPAL',
      description: 'Sede principal del Spa 1',
      address: 'Calle Principal 123, Piso 2',
      phone: '+1234567890',
      email: 'principal@spa1.com',
      openingTime: '09:00',
      closingTime: '18:00',
      isMain: true,
      spaId: spa1.id,
    },
  })

  console.log('✅ Sede 1 del Spa 1 creada:', spa1Branch1.name)

  // Crear usuario BRANCH_ADMIN para la Sede 1 del Spa 1
  const spa1Branch1Admin = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa1branch1@gmail.com',
      name: 'Administrador Sede 1 Spa 1',
      role: 'BRANCH_ADMIN',
      emailVerified: new Date(),
      spaId: spa1.id,
      branchId: spa1Branch1.id,
    },
  })

  console.log('✅ Usuario BRANCH_ADMIN de la Sede 1 del Spa 1 creado:', spa1Branch1Admin.email)

  // Crear usuario MANICURIST para la Sede 1 del Spa 1
  const spa1Branch1Manicurist = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa1branch1manicurista@gmail.com',
      name: 'Manicurista Sede 1 Spa 1',
      role: 'MANICURIST',
      emailVerified: new Date(),
      spaId: spa1.id,
      branchId: spa1Branch1.id,
    },
  })

  console.log('✅ Usuario MANICURIST de la Sede 1 del Spa 1 creado:', spa1Branch1Manicurist.email)

  // Crear Spa 2
  const spa2 = await prisma.spa.create({
    data: {
      name: 'Spa 2',
      slug: 'spa-2',
      address: 'Avenida Secundaria 456',
      phone: '+0987654321',
      email: 'info@spa2.com',
      openingTime: '08:00',
      closingTime: '19:00',
    },
  })

  console.log('✅ Spa 2 creado:', spa2.name)

  // Crear usuario SPA_ADMIN para Spa 2
  const spa2Admin = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa2@gmail.com',
      name: 'Administrador Spa 2',
      role: 'SPA_ADMIN',
      emailVerified: new Date(),
      spaId: spa2.id,
    },
  })

  console.log('✅ Usuario SPA_ADMIN del Spa 2 creado:', spa2Admin.email)

  // Crear Sede 1 del Spa 2
  const spa2Branch1 = await prisma.branch.create({
    data: {
      name: 'Sede Principal Spa 2',
      code: 'SPA2_PRINCIPAL',
      description: 'Sede principal del Spa 2',
      address: 'Avenida Secundaria 456, Piso 1',
      phone: '+0987654321',
      email: 'principal@spa2.com',
      openingTime: '08:00',
      closingTime: '19:00',
      isMain: true,
      spaId: spa2.id,
    },
  })

  console.log('✅ Sede 1 del Spa 2 creada:', spa2Branch1.name)

  // Crear usuario BRANCH_ADMIN para la Sede 1 del Spa 2
  const spa2Branch1Admin = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa2branch1@gmail.com',
      name: 'Administrador Sede 1 Spa 2',
      role: 'BRANCH_ADMIN',
      emailVerified: new Date(),
      spaId: spa2.id,
      branchId: spa2Branch1.id,
    },
  })

  console.log('✅ Usuario BRANCH_ADMIN de la Sede 1 del Spa 2 creado:', spa2Branch1Admin.email)

  // Crear usuario MANICURIST para la Sede 1 del Spa 2
  const spa2Branch1Manicurist = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa2branch1manicurista@gmail.com',
      name: 'Manicurista Sede 1 Spa 2',
      role: 'MANICURIST',
      emailVerified: new Date(),
      spaId: spa2.id,
      branchId: spa2Branch1.id,
    },
  })

  console.log('✅ Usuario MANICURIST de la Sede 1 del Spa 2 creado:', spa2Branch1Manicurist.email)

  console.log('🎉 Datos iniciales creados exitosamente!')
  console.log('\n📋 Resumen de usuarios creados:')
  console.log('SUPER_ADMIN: jlmonroy13@gmail.com')
  console.log('SPA_ADMIN (Spa 1): jlmonroy13+spa1@gmail.com')
  console.log('BRANCH_ADMIN (Spa 1, Sede 1): jlmonroy13+spa1branch1@gmail.com')
  console.log('MANICURIST (Spa 1, Sede 1): jlmonroy13+spa1branch1manicurista@gmail.com')
  console.log('SPA_ADMIN (Spa 2): jlmonroy13+spa2@gmail.com')
  console.log('BRANCH_ADMIN (Spa 2, Sede 1): jlmonroy13+spa2branch1@gmail.com')
  console.log('MANICURIST (Spa 2, Sede 1): jlmonroy13+spa2branch1manicurista@gmail.com')
}

main().finally(() => prisma.$disconnect())
