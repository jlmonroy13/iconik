import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpiando la base de datos de Iconik...');

  // Elimina todos los datos de todas las tablas relevantes
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.client.deleteMany();
  await prisma.manicurist.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.spa.deleteMany();

  console.log('✅ Base de datos vacía');

  console.log('🌱 Creando datos iniciales...');

  // Crear usuario SUPER_ADMIN
  const superAdmin = await prisma.user.create({
    data: {
      email: 'jlmonroy13@gmail.com',
      name: 'Super Administrador',
      role: 'SUPER_ADMIN',
      isSuperAdmin: true,
      emailVerified: new Date(),
    },
  });

  console.log('✅ Usuario SUPER_ADMIN creado:', superAdmin.email);

  // ===== SPA 1 =====
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
  });

  console.log('✅ Spa 1 creado:', spa1.name);

  // Crear usuario SPA_ADMIN para Spa 1
  const spa1Admin = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa1@gmail.com',
      name: 'Administrador Spa 1',
      role: 'SPA_ADMIN',
      emailVerified: new Date(),
      spaId: spa1.id,
    },
  });

  console.log('✅ Usuario SPA_ADMIN del Spa 1 creado:', spa1Admin.email);

  // ===== SPA 1 - SEDE 1 (Principal) =====
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
  });

  console.log('✅ Sede 1 del Spa 1 creada:', spa1Branch1.name);

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
  });

  console.log(
    '✅ Usuario BRANCH_ADMIN de la Sede 1 del Spa 1 creado:',
    spa1Branch1Admin.email
  );

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
  });

  console.log(
    '✅ Usuario MANICURIST de la Sede 1 del Spa 1 creado:',
    spa1Branch1Manicurist.email
  );

  // ===== SPA 1 - SEDE 2 (Secundaria) =====
  const spa1Branch2 = await prisma.branch.create({
    data: {
      name: 'Sede Norte Spa 1',
      code: 'SPA1_NORTE',
      description: 'Sede norte del Spa 1',
      address: 'Avenida Norte 456, Local 15',
      phone: '+1234567891',
      email: 'norte@spa1.com',
      openingTime: '08:30',
      closingTime: '17:30',
      isMain: false,
      spaId: spa1.id,
    },
  });

  console.log('✅ Sede 2 del Spa 1 creada:', spa1Branch2.name);

  // Crear usuario BRANCH_ADMIN para la Sede 2 del Spa 1
  const spa1Branch2Admin = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa1branch2@gmail.com',
      name: 'Administrador Sede 2 Spa 1',
      role: 'BRANCH_ADMIN',
      emailVerified: new Date(),
      spaId: spa1.id,
      branchId: spa1Branch2.id,
    },
  });

  console.log(
    '✅ Usuario BRANCH_ADMIN de la Sede 2 del Spa 1 creado:',
    spa1Branch2Admin.email
  );

  // Crear usuario MANICURIST para la Sede 2 del Spa 1
  const spa1Branch2Manicurist = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa1branch2manicurista@gmail.com',
      name: 'Manicurista Sede 2 Spa 1',
      role: 'MANICURIST',
      emailVerified: new Date(),
      spaId: spa1.id,
      branchId: spa1Branch2.id,
    },
  });

  console.log(
    '✅ Usuario MANICURIST de la Sede 2 del Spa 1 creado:',
    spa1Branch2Manicurist.email
  );

  // ===== SPA 2 =====
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
  });

  console.log('✅ Spa 2 creado:', spa2.name);

  // Crear usuario SPA_ADMIN para Spa 2
  const spa2Admin = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa2@gmail.com',
      name: 'Administrador Spa 2',
      role: 'SPA_ADMIN',
      emailVerified: new Date(),
      spaId: spa2.id,
    },
  });

  console.log('✅ Usuario SPA_ADMIN del Spa 2 creado:', spa2Admin.email);

  // ===== SPA 2 - SEDE 1 (Principal) =====
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
  });

  console.log('✅ Sede 1 del Spa 2 creada:', spa2Branch1.name);

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
  });

  console.log(
    '✅ Usuario BRANCH_ADMIN de la Sede 1 del Spa 2 creado:',
    spa2Branch1Admin.email
  );

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
  });

  console.log(
    '✅ Usuario MANICURIST de la Sede 1 del Spa 2 creado:',
    spa2Branch1Manicurist.email
  );

  // ===== SPA 2 - SEDE 2 (Secundaria) =====
  const spa2Branch2 = await prisma.branch.create({
    data: {
      name: 'Sede Sur Spa 2',
      code: 'SPA2_SUR',
      description: 'Sede sur del Spa 2',
      address: 'Calle Sur 789, Centro Comercial Plaza Sur',
      phone: '+0987654322',
      email: 'sur@spa2.com',
      openingTime: '09:30',
      closingTime: '18:30',
      isMain: false,
      spaId: spa2.id,
    },
  });

  console.log('✅ Sede 2 del Spa 2 creada:', spa2Branch2.name);

  // Crear usuario BRANCH_ADMIN para la Sede 2 del Spa 2
  const spa2Branch2Admin = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa2branch2@gmail.com',
      name: 'Administrador Sede 2 Spa 2',
      role: 'BRANCH_ADMIN',
      emailVerified: new Date(),
      spaId: spa2.id,
      branchId: spa2Branch2.id,
    },
  });

  console.log(
    '✅ Usuario BRANCH_ADMIN de la Sede 2 del Spa 2 creado:',
    spa2Branch2Admin.email
  );

  // Crear usuario MANICURIST para la Sede 2 del Spa 2
  const spa2Branch2Manicurist = await prisma.user.create({
    data: {
      email: 'jlmonroy13+spa2branch2manicurista@gmail.com',
      name: 'Manicurista Sede 2 Spa 2',
      role: 'MANICURIST',
      emailVerified: new Date(),
      spaId: spa2.id,
      branchId: spa2Branch2.id,
    },
  });

  console.log(
    '✅ Usuario MANICURIST de la Sede 2 del Spa 2 creado:',
    spa2Branch2Manicurist.email
  );

  console.log('🎉 Datos iniciales creados exitosamente!');
  console.log('\n📋 Resumen de usuarios creados:');
  console.log('SUPER_ADMIN: jlmonroy13@gmail.com');
  console.log('\n=== SPA 1 ===');
  console.log('SPA_ADMIN: jlmonroy13+spa1@gmail.com');
  console.log('BRANCH_ADMIN (Sede 1): jlmonroy13+spa1branch1@gmail.com');
  console.log(
    'MANICURIST (Sede 1): jlmonroy13+spa1branch1manicurista@gmail.com'
  );
  console.log('BRANCH_ADMIN (Sede 2): jlmonroy13+spa1branch2@gmail.com');
  console.log(
    'MANICURIST (Sede 2): jlmonroy13+spa1branch2manicurista@gmail.com'
  );
  console.log('\n=== SPA 2 ===');
  console.log('SPA_ADMIN: jlmonroy13+spa2@gmail.com');
  console.log('BRANCH_ADMIN (Sede 1): jlmonroy13+spa2branch1@gmail.com');
  console.log(
    'MANICURIST (Sede 1): jlmonroy13+spa2branch1manicurista@gmail.com'
  );
  console.log('BRANCH_ADMIN (Sede 2): jlmonroy13+spa2branch2@gmail.com');
  console.log(
    'MANICURIST (Sede 2): jlmonroy13+spa2branch2manicurista@gmail.com'
  );
}

main().finally(() => prisma.$disconnect());
