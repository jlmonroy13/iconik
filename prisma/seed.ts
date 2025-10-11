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

  // ===== CREAR SERVICIOS PARA TODAS LAS SEDES =====
  console.log('🛠️ Creando servicios para todas las sedes...');

  const servicesData = [
    {
      name: 'Manicure tradicional',
      description: 'Manicure clásico con esmalte tradicional',
      price: 18000,
      duration: 45,
      type: 'MANICURE_PEDICURE' as const,
      recommendedReturnDays: 7,
    },
    {
      name: 'Pedicure tradicional',
      description: 'Pedicure clásico con esmalte tradicional',
      price: 21000,
      duration: 60,
      type: 'MANICURE_PEDICURE' as const,
      recommendedReturnDays: 15,
    },
    {
      name: 'Manicure y pedicure tradicional',
      description: 'Combo de manicure y pedicure tradicional',
      price: 32000,
      duration: 90,
      type: 'MANICURE_PEDICURE' as const,
      recommendedReturnDays: 15,
    },
    {
      name: 'Manicure secado rápido',
      description: 'Manicure con esmalte de secado rápido',
      price: 26000,
      duration: 45,
      type: 'MANICURE_PEDICURE' as const,
      recommendedReturnDays: 7,
    },
    {
      name: 'Pedicure secado rápido',
      description: 'Pedicure con esmalte de secado rápido',
      price: 28000,
      duration: 60,
      type: 'MANICURE_PEDICURE' as const,
      recommendedReturnDays: 15,
    },
    {
      name: 'Manicure y pedicure secado rápido',
      description: 'Combo de manicure y pedicure con secado rápido',
      price: 42000,
      duration: 90,
      type: 'MANICURE_PEDICURE' as const,
      recommendedReturnDays: 15,
    },
    {
      name: 'Manicure semipermanente',
      description: 'Manicure con esmalte semipermanente',
      price: 41000,
      duration: 60,
      type: 'MANICURE_PEDICURE' as const,
      recommendedReturnDays: 21,
    },
    {
      name: 'Pedicure semipermanente',
      description: 'Pedicure con esmalte semipermanente',
      price: 41000,
      duration: 75,
      type: 'MANICURE_PEDICURE' as const,
      recommendedReturnDays: 21,
    },
    {
      name: 'Manicure y pedicure semipermanente',
      description: 'Combo de manicure y pedicure semipermanente',
      price: 77000,
      duration: 120,
      type: 'MANICURE_PEDICURE' as const,
      recommendedReturnDays: 21,
    },
    {
      name: 'Retiro semipermanente',
      description: 'Retiro de esmalte semipermanente',
      price: 10000,
      duration: 30,
      type: 'NAIL_MAINTENANCE' as const,
    },
    {
      name: 'Retiro Acrílicas o Polygel',
      description: 'Retiro de uñas acrílicas o polygel',
      price: 25000,
      duration: 45,
      type: 'NAIL_MAINTENANCE' as const,
    },
    {
      name: 'Retiro base rubber',
      description: 'Retiro de base rubber',
      price: 15000,
      duration: 30,
      type: 'NAIL_MAINTENANCE' as const,
    },
    {
      name: 'Baño o mantenimiento acrílico',
      description: 'Baño o mantenimiento de uñas acrílicas',
      price: 76000,
      duration: 90,
      type: 'NAIL_EXTENSIONS' as const,
      recommendedReturnDays: 21,
    },
    {
      name: 'Baño o mantenimiento Polygel',
      description: 'Baño o mantenimiento de uñas polygel',
      price: 91000,
      duration: 90,
      type: 'NAIL_EXTENSIONS' as const,
      recommendedReturnDays: 21,
    },
    {
      name: 'Base rubber',
      description: 'Aplicación de base rubber',
      price: 76000,
      duration: 90,
      type: 'NAIL_EXTENSIONS' as const,
      recommendedReturnDays: 21,
    },
    {
      name: 'Polygel desde',
      description: 'Aplicación de polygel (precio desde)',
      price: 131000,
      duration: 120,
      type: 'NAIL_EXTENSIONS' as const,
      recommendedReturnDays: 21,
    },
    {
      name: 'Acrílicas desde',
      description: 'Aplicación de uñas acrílicas (precio desde)',
      price: 91000,
      duration: 120,
      type: 'NAIL_EXTENSIONS' as const,
      recommendedReturnDays: 21,
    },
    {
      name: 'Esculpidas desde',
      description: 'Uñas esculpidas (precio desde)',
      price: 101000,
      duration: 120,
      type: 'NAIL_EXTENSIONS' as const,
      recommendedReturnDays: 21,
    },
    {
      name: 'Kit de limpieza básico',
      description: 'Kit de limpieza básico para manicure y pedicure',
      price: 2500,
      duration: 0,
      type: 'SPA_TREATMENTS' as const,
    },
    {
      name: 'Kit de limpieza premium',
      description: 'Kit de limpieza premium con productos especializados',
      price: 5000,
      duration: 0,
      type: 'SPA_TREATMENTS' as const,
    },
  ];

  // Crear servicios para cada sede
  const allBranches = [spa1Branch1, spa1Branch2, spa2Branch1, spa2Branch2];

  for (const branch of allBranches) {
    for (const serviceData of servicesData) {
      await prisma.service.create({
        data: {
          ...serviceData,
          spaId: branch.spaId,
          branchId: branch.id,
          isActive: true,
        },
      });
    }
    console.log(`✅ Servicios creados para ${branch.name}`);
  }

  // ===== CREAR MANICURISTAS =====
  console.log('💅 Creando manicuristas...');

  const manicurist1Spa1Branch1 = await prisma.manicurist.create({
    data: {
      name: 'María García',
      phone: '+573001234567',
      email: 'maria.garcia@spa1.com',
      commission: 0.5, // 50%
      isActive: true,
      spaId: spa1.id,
      branchId: spa1Branch1.id,
    },
  });

  const manicurist2Spa1Branch1 = await prisma.manicurist.create({
    data: {
      name: 'Ana Martínez',
      phone: '+573007654321',
      email: 'ana.martinez@spa1.com',
      commission: 0.45, // 45%
      isActive: true,
      spaId: spa1.id,
      branchId: spa1Branch1.id,
    },
  });

  const manicurist1Spa1Branch2 = await prisma.manicurist.create({
    data: {
      name: 'Sofía Torres',
      phone: '+573009876543',
      email: 'sofia.torres@spa1.com',
      commission: 0.5, // 50%
      isActive: true,
      spaId: spa1.id,
      branchId: spa1Branch2.id,
    },
  });

  const manicurist1Spa2Branch1 = await prisma.manicurist.create({
    data: {
      name: 'Laura Rodríguez',
      phone: '+573001111111',
      email: 'laura.rodriguez@spa2.com',
      commission: 0.5, // 50%
      isActive: true,
      spaId: spa2.id,
      branchId: spa2Branch1.id,
    },
  });

  console.log('✅ Manicuristas creadas exitosamente');

  // ===== ASIGNAR SERVICIOS A MANICURISTAS =====
  console.log('🎯 Asignando servicios a manicuristas...');

  // Obtener todos los servicios creados
  const allServices = await prisma.service.findMany();

  // María García (Spa 1, Sede 1) - Puede hacer todos los servicios
  const mariaServices = allServices.filter(
    s => s.spaId === spa1.id && s.branchId === spa1Branch1.id
  );

  for (const service of mariaServices) {
    await prisma.manicuristService.create({
      data: {
        manicuristId: manicurist1Spa1Branch1.id,
        serviceId: service.id,
        spaId: spa1.id,
        branchId: spa1Branch1.id,
        isActive: true,
      },
    });
  }
  console.log(
    `✅ Servicios asignados a ${manicurist1Spa1Branch1.name}: ${mariaServices.length}`
  );

  // Ana Martínez (Spa 1, Sede 1) - Solo hace servicios básicos (sin extensiones)
  const anaServices = allServices.filter(
    s =>
      s.spaId === spa1.id &&
      s.branchId === spa1Branch1.id &&
      s.type !== 'NAIL_EXTENSIONS'
  );

  for (const service of anaServices) {
    await prisma.manicuristService.create({
      data: {
        manicuristId: manicurist2Spa1Branch1.id,
        serviceId: service.id,
        spaId: spa1.id,
        branchId: spa1Branch1.id,
        isActive: true,
      },
    });
  }
  console.log(
    `✅ Servicios asignados a ${manicurist2Spa1Branch1.name}: ${anaServices.length}`
  );

  // Sofía Torres (Spa 1, Sede 2) - Especialista en extensiones
  const sofiaServices = allServices.filter(
    s =>
      s.spaId === spa1.id &&
      s.branchId === spa1Branch2.id &&
      (s.type === 'NAIL_EXTENSIONS' ||
        s.type === 'NAIL_MAINTENANCE' ||
        s.type === 'MANICURE_PEDICURE')
  );

  for (const service of sofiaServices) {
    await prisma.manicuristService.create({
      data: {
        manicuristId: manicurist1Spa1Branch2.id,
        serviceId: service.id,
        spaId: spa1.id,
        branchId: spa1Branch2.id,
        isActive: true,
      },
    });
  }
  console.log(
    `✅ Servicios asignados a ${manicurist1Spa1Branch2.name}: ${sofiaServices.length}`
  );

  // Laura Rodríguez (Spa 2, Sede 1) - Puede hacer todos los servicios
  const lauraServices = allServices.filter(
    s => s.spaId === spa2.id && s.branchId === spa2Branch1.id
  );

  for (const service of lauraServices) {
    await prisma.manicuristService.create({
      data: {
        manicuristId: manicurist1Spa2Branch1.id,
        serviceId: service.id,
        spaId: spa2.id,
        branchId: spa2Branch1.id,
        isActive: true,
      },
    });
  }
  console.log(
    `✅ Servicios asignados a ${manicurist1Spa2Branch1.name}: ${lauraServices.length}`
  );

  // ===== CREAR HORARIOS PARA MANICURISTAS =====
  console.log('⏰ Creando horarios para manicuristas...');

  // María - Lunes a Sábado (09:00 - 18:00)
  const mariaSchedule = [
    { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Lunes
    { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' }, // Martes
    { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' }, // Miércoles
    { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' }, // Jueves
    { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' }, // Viernes
    { dayOfWeek: 6, startTime: '10:00', endTime: '14:00' }, // Sábado
  ];

  for (const schedule of mariaSchedule) {
    await prisma.manicuristSchedule.create({
      data: {
        ...schedule,
        manicuristId: manicurist1Spa1Branch1.id,
        spaId: spa1.id,
        isActive: true,
      },
    });
  }
  console.log(`✅ Horario creado para ${manicurist1Spa1Branch1.name}`);

  // Ana - Lunes a Viernes (08:00 - 17:00)
  const anaSchedule = [
    { dayOfWeek: 1, startTime: '08:00', endTime: '17:00' }, // Lunes
    { dayOfWeek: 2, startTime: '08:00', endTime: '17:00' }, // Martes
    { dayOfWeek: 3, startTime: '08:00', endTime: '17:00' }, // Miércoles
    { dayOfWeek: 4, startTime: '08:00', endTime: '17:00' }, // Jueves
    { dayOfWeek: 5, startTime: '08:00', endTime: '17:00' }, // Viernes
  ];

  for (const schedule of anaSchedule) {
    await prisma.manicuristSchedule.create({
      data: {
        ...schedule,
        manicuristId: manicurist2Spa1Branch1.id,
        spaId: spa1.id,
        isActive: true,
      },
    });
  }
  console.log(`✅ Horario creado para ${manicurist2Spa1Branch1.name}`);

  // Sofía - Miércoles a Domingo (10:00 - 19:00)
  const sofiaSchedule = [
    { dayOfWeek: 3, startTime: '10:00', endTime: '19:00' }, // Miércoles
    { dayOfWeek: 4, startTime: '10:00', endTime: '19:00' }, // Jueves
    { dayOfWeek: 5, startTime: '10:00', endTime: '19:00' }, // Viernes
    { dayOfWeek: 6, startTime: '10:00', endTime: '19:00' }, // Sábado
    { dayOfWeek: 0, startTime: '10:00', endTime: '15:00' }, // Domingo
  ];

  for (const schedule of sofiaSchedule) {
    await prisma.manicuristSchedule.create({
      data: {
        ...schedule,
        manicuristId: manicurist1Spa1Branch2.id,
        spaId: spa1.id,
        isActive: true,
      },
    });
  }
  console.log(`✅ Horario creado para ${manicurist1Spa1Branch2.name}`);

  // Laura - Lunes a Sábado (09:00 - 18:00)
  const lauraSchedule = [
    { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Lunes
    { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' }, // Martes
    { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' }, // Miércoles
    { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' }, // Jueves
    { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' }, // Viernes
    { dayOfWeek: 6, startTime: '09:00', endTime: '14:00' }, // Sábado
  ];

  for (const schedule of lauraSchedule) {
    await prisma.manicuristSchedule.create({
      data: {
        ...schedule,
        manicuristId: manicurist1Spa2Branch1.id,
        spaId: spa2.id,
        isActive: true,
      },
    });
  }
  console.log(`✅ Horario creado para ${manicurist1Spa2Branch1.name}`);

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
