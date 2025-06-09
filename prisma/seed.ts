import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database for Iconik...')

  // Clear existing data (optional - comment out if you want to keep existing data)
  await prisma.appointment.deleteMany()
  await prisma.service.deleteMany()
  await prisma.client.deleteMany()
  await prisma.manicurist.deleteMany()
  await prisma.user.deleteMany()
  await prisma.spa.deleteMany()

  // Create Spas
  const spa1 = await prisma.spa.create({
    data: {
      name: 'Bella Nails Spa',
      slug: 'bella-nails-spa',
      address: 'Calle 93 #15-20, Bogotá',
      phone: '+57 301 234 5678',
      email: 'info@bellanails.com',
      logoUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    },
  })

  const spa2 = await prisma.spa.create({
    data: {
      name: 'Glamour Nails Studio',
      slug: 'glamour-nails-studio',
      address: 'Carrera 11 #85-32, Bogotá',
      phone: '+57 301 987 6543',
      email: 'contacto@glamournails.com',
      logoUrl: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400',
    },
  })

  console.log('✅ Created spas')

  // Create Admin Users (simple passwords for development)
  await prisma.user.create({
    data: {
      email: 'admin@bellanails.com',
      name: 'María González',
      password: 'admin123',
      role: 'ADMIN',
      spaId: spa1.id,
    },
  })

  await prisma.user.create({
    data: {
      email: 'admin@glamournails.com',
      name: 'Carmen Rodríguez',
      password: 'admin123',
      role: 'ADMIN',
      spaId: spa2.id,
    },
  })

  console.log('✅ Created admin users')

  // Create Manicurists
  const manicurist1 = await prisma.manicurist.create({
    data: {
      name: 'Andrea Vargas',
      phone: '+57 301 111 2222',
      email: 'andrea@bellanails.com',
      specialty: 'Nail Art y Diseños',
      commission: 0.6,
      spaId: spa1.id,
    },
  })

  const manicurist2 = await prisma.manicurist.create({
    data: {
      name: 'Valentina Morales',
      phone: '+57 301 333 4444',
      email: 'vale@bellanails.com',
      specialty: 'Manicure y Pedicure Clásico',
      commission: 0.55,
      spaId: spa1.id,
    },
  })

  const manicurist3 = await prisma.manicurist.create({
    data: {
      name: 'Daniela Castro',
      phone: '+57 301 555 6666',
      email: 'dani@glamournails.com',
      specialty: 'Uñas Acrílicas y Gel',
      commission: 0.65,
      spaId: spa2.id,
    },
  })

  console.log('✅ Created manicurists')

  // Create Manicurist Users
  await prisma.user.create({
    data: {
      email: 'andrea@bellanails.com',
      name: 'Andrea Vargas',
      password: 'mani123',
      role: 'MANICURIST',
      spaId: spa1.id,
    },
  })

  await prisma.user.create({
    data: {
      email: 'vale@bellanails.com',
      name: 'Valentina Morales',
      password: 'mani123',
      role: 'MANICURIST',
      spaId: spa1.id,
    },
  })

  await prisma.user.create({
    data: {
      email: 'dani@glamournails.com',
      name: 'Daniela Castro',
      password: 'mani123',
      role: 'MANICURIST',
      spaId: spa2.id,
    },
  })

  console.log('✅ Created manicurist users')

  // Create Clients
  const client1 = await prisma.client.create({
    data: {
      name: 'Sofía Martínez',
      phone: '+57 301 777 8888',
      email: 'sofia.martinez@gmail.com',
      birthday: new Date('1995-03-15'),
      notes: 'Prefiere colores pasteles, alérgica al acrílico',
      spaId: spa1.id,
    },
  })

  const client2 = await prisma.client.create({
    data: {
      name: 'Isabella Torres',
      phone: '+57 301 999 0000',
      email: 'isa.torres@hotmail.com',
      birthday: new Date('1988-07-22'),
      notes: 'Le gusta el nail art detallado',
      spaId: spa1.id,
    },
  })

  const client3 = await prisma.client.create({
    data: {
      name: 'Camila Herrera',
      phone: '+57 301 111 3333',
      email: 'camila.h@outlook.com',
      birthday: new Date('1992-11-08'),
      spaId: spa1.id,
    },
  })

  const client4 = await prisma.client.create({
    data: {
      name: 'Alejandra Ruiz',
      phone: '+57 301 444 5555',
      email: 'ale.ruiz@gmail.com',
      birthday: new Date('1990-05-12'),
      spaId: spa2.id,
    },
  })

  const client5 = await prisma.client.create({
    data: {
      name: 'Natalia Gómez',
      phone: '+57 301 666 7777',
      email: 'naty.gomez@yahoo.com',
      birthday: new Date('1987-09-30'),
      notes: 'Viene cada 2 semanas, prefiere gel polish',
      spaId: spa2.id,
    },
  })

  console.log('✅ Created clients')

  // Create Client Users
  await prisma.user.create({
    data: {
      email: 'sofia.martinez@gmail.com',
      name: 'Sofía Martínez',
      password: 'client123',
      role: 'CLIENT',
      spaId: spa1.id,
    },
  })

  await prisma.user.create({
    data: {
      email: 'isa.torres@hotmail.com',
      name: 'Isabella Torres',
      password: 'client123',
      role: 'CLIENT',
      spaId: spa1.id,
    },
  })

  console.log('✅ Created client users')

  // Create Services (historical data)
  const services = [
    {
      type: 'MANICURE' as const,
      clientId: client1.id,
      manicuristId: manicurist1.id,
      price: 25000,
      duration: 60,
      notes: 'Manicure clásico con esmalte rosa',
      rating: 5,
      paymentMethod: 'CASH' as const,
      spaId: spa1.id,
      createdAt: new Date('2024-05-15'),
    },
    {
      type: 'NAIL_ART' as const,
      clientId: client2.id,
      manicuristId: manicurist1.id,
      price: 45000,
      duration: 90,
      notes: 'Diseño floral con colores pasteles',
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
      rating: 5,
      paymentMethod: 'CARD' as const,
      spaId: spa1.id,
      createdAt: new Date('2024-05-20'),
    },
    {
      type: 'PEDICURE' as const,
      clientId: client1.id,
      manicuristId: manicurist2.id,
      price: 30000,
      duration: 75,
      notes: 'Pedicure spa con exfoliación',
      rating: 4,
      paymentMethod: 'NEQUI' as const,
      spaId: spa1.id,
      createdAt: new Date('2024-05-22'),
    },
    {
      type: 'GEL_POLISH' as const,
      clientId: client3.id,
      manicuristId: manicurist2.id,
      price: 35000,
      duration: 45,
      notes: 'Gel polish color rojo',
      rating: 5,
      paymentMethod: 'TRANSFER' as const,
      spaId: spa1.id,
      createdAt: new Date('2024-05-25'),
    },
    {
      type: 'ACRYLIC_NAILS' as const,
      clientId: client4.id,
      manicuristId: manicurist3.id,
      price: 55000,
      duration: 120,
      notes: 'Uñas acrílicas con decoración',
      imageUrl: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400',
      rating: 5,
      paymentMethod: 'CARD' as const,
      spaId: spa2.id,
      createdAt: new Date('2024-05-28'),
    },
    {
      type: 'HAND_SPA' as const,
      clientId: client5.id,
      manicuristId: manicurist3.id,
      price: 40000,
      duration: 60,
      notes: 'Spa de manos con hidratación profunda',
      rating: 4,
      paymentMethod: 'DAVIPLATA' as const,
      spaId: spa2.id,
      createdAt: new Date('2024-05-30'),
    },
  ]

  for (const service of services) {
    await prisma.service.create({ data: service })
  }

  console.log('✅ Created services')

  // Create Appointments (future appointments)
  const appointments = [
    {
      clientId: client1.id,
      manicuristId: manicurist1.id,
      serviceType: 'MANICURE' as const,
      scheduledAt: new Date('2024-06-15T10:00:00'),
      duration: 60,
      price: 25000,
      status: 'CONFIRMED' as const,
      notes: 'Cita regular - colores suaves',
      spaId: spa1.id,
    },
    {
      clientId: client2.id,
      manicuristId: manicurist1.id,
      serviceType: 'NAIL_ART' as const,
      scheduledAt: new Date('2024-06-16T14:00:00'),
      duration: 90,
      price: 45000,
      status: 'SCHEDULED' as const,
      notes: 'Diseño especial para evento',
      spaId: spa1.id,
    },
    {
      clientId: client4.id,
      manicuristId: manicurist3.id,
      serviceType: 'GEL_POLISH' as const,
      scheduledAt: new Date('2024-06-17T11:30:00'),
      duration: 45,
      price: 35000,
      status: 'SCHEDULED' as const,
      spaId: spa2.id,
    },
  ]

  for (const appointment of appointments) {
    await prisma.appointment.create({ data: appointment })
  }

  console.log('✅ Created appointments')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log(`- ${await prisma.spa.count()} spas created`)
  console.log(`- ${await prisma.user.count()} users created`)
  console.log(`- ${await prisma.manicurist.count()} manicurists created`)
  console.log(`- ${await prisma.client.count()} clients created`)
  console.log(`- ${await prisma.service.count()} services created`)
  console.log(`- ${await prisma.appointment.count()} appointments created`)

  console.log('\n🔑 Login credentials (plain text for development):')
  console.log('Admin Bella Nails: admin@bellanails.com / admin123')
  console.log('Admin Glamour Nails: admin@glamournails.com / admin123')
  console.log('Manicurist: andrea@bellanails.com / mani123')
  console.log('Client: sofia.martinez@gmail.com / client123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
