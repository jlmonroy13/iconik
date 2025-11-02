import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpiando la base de datos de Iconik...');

  // Elimina todos los datos de todas las tablas relevantes (orden importa por foreign keys)
  await prisma.expensePayment.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.payment.deleteMany(); // Pagos primero
  await prisma.appointmentService.deleteMany(); // Servicios de citas
  await prisma.appointment.deleteMany(); // Luego citas
  await prisma.spaAccount.deleteMany();
  await prisma.paymentMethod.deleteMany();
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
      email: 'image.png',
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

  // ===== CREAR CUENTAS DEL SPA (Donde el spa recibe/guarda dinero) =====
  // IMPORTANTE: Crear PRIMERO las cuentas antes que los métodos de pago
  console.log('🏦 Creando cuentas del spa...');

  // Cuentas del Spa 1
  const cajaPrincipalSpa1 = await prisma.spaAccount.create({
    data: {
      name: 'Caja Principal Spa 1',
      description: 'Caja física principal para pagos en efectivo',
      type: 'CASH',
      balance: 500000, // $500,000 inicial
      isActive: true,
      spaId: spa1.id,
    },
  });

  const cuentaBancolombiaAhorrosSpa1 = await prisma.spaAccount.create({
    data: {
      name: 'Cuenta Bancolombia Ahorros',
      description: 'Cuenta de ahorros principal del spa',
      type: 'BANK_ACCOUNT',
      bank: 'Bancolombia',
      accountNumber: '12345678901',
      balance: 2500000, // $2,500,000 inicial
      isActive: true,
      spaId: spa1.id,
    },
  });

  const cuentaNequiNegocioSpa1 = await prisma.spaAccount.create({
    data: {
      name: 'Nequi Negocio',
      description: 'Cuenta Nequi del negocio para recibir pagos',
      type: 'DIGITAL_WALLET',
      bank: 'Nequi',
      accountNumber: '3001234567',
      balance: 850000, // $850,000 inicial
      isActive: true,
      spaId: spa1.id,
    },
  });

  const cuentaDaviplataSpa1 = await prisma.spaAccount.create({
    data: {
      name: 'Daviplata Empresarial',
      description: 'Cuenta Daviplata del negocio',
      type: 'DIGITAL_WALLET',
      bank: 'Davivienda',
      accountNumber: '3109876543',
      balance: 650000, // $650,000 inicial
      isActive: true,
      spaId: spa1.id,
    },
  });

  await prisma.spaAccount.create({
    data: {
      name: 'Caja Chica - Sede Principal',
      description: 'Caja chica para gastos menores de la sede principal',
      type: 'CASH',
      balance: 200000, // $200,000 inicial
      isActive: true,
      spaId: spa1.id,
      branchId: spa1Branch1.id,
    },
  });

  console.log('✅ Cuentas creadas para Spa 1');

  // Cuentas del Spa 2
  const cajaPrincipalSpa2 = await prisma.spaAccount.create({
    data: {
      name: 'Caja Principal Spa 2',
      description: 'Caja física principal',
      type: 'CASH',
      balance: 400000,
      isActive: true,
      spaId: spa2.id,
    },
  });

  const cuentaDaviviendaSpa2 = await prisma.spaAccount.create({
    data: {
      name: 'Cuenta Davivienda Corriente',
      description: 'Cuenta corriente principal',
      type: 'BANK_ACCOUNT',
      bank: 'Davivienda',
      accountNumber: '98765432101',
      balance: 1800000,
      isActive: true,
      spaId: spa2.id,
    },
  });

  const cuentaNequiSpa2 = await prisma.spaAccount.create({
    data: {
      name: 'Nequi Negocio Spa 2',
      description: 'Cuenta Nequi del negocio',
      type: 'DIGITAL_WALLET',
      bank: 'Nequi',
      accountNumber: '3209876543',
      balance: 550000,
      isActive: true,
      spaId: spa2.id,
    },
  });

  console.log('✅ Cuentas creadas para Spa 2');

  // ===== CREAR MÉTODOS DE PAGO (Para que los clientes paguen) =====
  // IMPORTANTE: Los métodos de pago ahora están asociados a las cuentas donde llega el dinero
  console.log('💳 Creando métodos de pago...');

  // Métodos de pago para Spa 1
  await prisma.paymentMethod.createMany({
    data: [
      {
        name: 'Efectivo',
        type: 'Cash',
        icon: '💵',
        transactionFee: 0,
        isActive: true,
        spaId: spa1.id,
        spaAccountId: cajaPrincipalSpa1.id, // 💰 Efectivo va a Caja Principal
      },
      {
        name: 'Nequi',
        type: 'Digital',
        icon: '📱',
        transactionFee: 0,
        isActive: true,
        spaId: spa1.id,
        spaAccountId: cuentaNequiNegocioSpa1.id, // 📱 Nequi va a cuenta Nequi
      },
      {
        name: 'Daviplata',
        type: 'Digital',
        icon: '💰',
        transactionFee: 0,
        isActive: true,
        spaId: spa1.id,
        spaAccountId: cuentaDaviplataSpa1.id, // 💰 Daviplata va a cuenta Daviplata
      },
      {
        name: 'Tarjeta de Crédito',
        type: 'Card',
        icon: '💳',
        transactionFee: 0.035, // 3.5% de comisión
        isActive: true,
        spaId: spa1.id,
        spaAccountId: cuentaBancolombiaAhorrosSpa1.id, // 💳 Tarjetas van a cuenta bancaria
      },
      {
        name: 'Tarjeta de Débito',
        type: 'Card',
        icon: '💳',
        transactionFee: 0.025, // 2.5% de comisión
        isActive: true,
        spaId: spa1.id,
        spaAccountId: cuentaBancolombiaAhorrosSpa1.id, // 💳 Tarjetas van a cuenta bancaria
      },
      {
        name: 'Transferencia Bancaria',
        type: 'Digital',
        icon: '🏦',
        transactionFee: 0,
        isActive: true,
        spaId: spa1.id,
        spaAccountId: cuentaBancolombiaAhorrosSpa1.id, // 🏦 Transferencias van a cuenta bancaria
      },
    ],
  });

  console.log('✅ Métodos de pago creados para Spa 1');

  // Métodos de pago para Spa 2
  await prisma.paymentMethod.createMany({
    data: [
      {
        name: 'Efectivo',
        type: 'Cash',
        icon: '💵',
        transactionFee: 0,
        isActive: true,
        spaId: spa2.id,
        spaAccountId: cajaPrincipalSpa2.id, // 💰 Efectivo va a Caja Principal
      },
      {
        name: 'Nequi',
        type: 'Digital',
        icon: '📱',
        transactionFee: 0,
        isActive: true,
        spaId: spa2.id,
        spaAccountId: cuentaNequiSpa2.id, // 📱 Nequi va a cuenta Nequi
      },
      {
        name: 'Daviplata',
        type: 'Digital',
        icon: '💰',
        transactionFee: 0,
        isActive: true,
        spaId: spa2.id,
        spaAccountId: cuentaDaviviendaSpa2.id, // 💰 Daviplata va a cuenta bancaria
      },
      {
        name: 'Tarjeta de Crédito',
        type: 'Card',
        icon: '💳',
        transactionFee: 0.035,
        isActive: true,
        spaId: spa2.id,
        spaAccountId: cuentaDaviviendaSpa2.id, // 💳 Tarjetas van a cuenta bancaria
      },
    ],
  });

  console.log('✅ Métodos de pago creados para Spa 2');

  // ===== CREAR CLIENTES =====
  console.log('👥 Creando clientes de ejemplo...');

  // Clientes del Spa 1
  const cliente1Spa1 = await prisma.client.create({
    data: {
      name: 'María López García',
      documentType: 'CC',
      documentNumber: '1234567890',
      phone: '3001234567',
      email: 'maria.lopez@example.com',
      birthday: new Date('1990-05-15'),
      notes: 'Cliente frecuente, prefiere diseños modernos',
      spaId: spa1.id,
      branchId: spa1Branch1.id,
    },
  });

  const cliente2Spa1 = await prisma.client.create({
    data: {
      name: 'Ana María Rodríguez',
      documentType: 'CC',
      documentNumber: '9876543210',
      phone: '3109876543',
      email: 'ana.rodriguez@example.com',
      birthday: new Date('1985-08-22'),
      notes: 'Le gusta mucho el nail art',
      spaId: spa1.id,
      branchId: spa1Branch1.id,
    },
  });

  const cliente3Spa1 = await prisma.client.create({
    data: {
      name: 'Laura Martínez Silva',
      documentType: 'CC',
      documentNumber: '1122334455',
      phone: '3201122334',
      email: 'laura.martinez@example.com',
      birthday: new Date('1992-03-10'),
      spaId: spa1.id,
      branchId: spa1Branch1.id,
    },
  });

  const cliente4Spa1 = await prisma.client.create({
    data: {
      name: 'Carolina Pérez Gómez',
      documentType: 'CC',
      documentNumber: '5566778899',
      phone: '3155667788',
      spaId: spa1.id,
      branchId: spa1Branch2.id,
    },
  });

  console.log('✅ Clientes creados para Spa 1');

  // Clientes del Spa 2
  await prisma.client.createMany({
    data: [
      {
        name: 'Patricia González Torres',
        documentType: 'CC',
        documentNumber: '2233445566',
        phone: '3202233445',
        email: 'patricia.gonzalez@example.com',
        birthday: new Date('1988-11-30'),
        spaId: spa2.id,
        branchId: spa2Branch1.id,
      },
      {
        name: 'Daniela Castro Ruiz',
        documentType: 'CC',
        documentNumber: '6677889900',
        phone: '3106677889',
        spaId: spa2.id,
        branchId: spa2Branch1.id,
      },
    ],
  });

  console.log('✅ Clientes creados para Spa 2');

  // ===== CREAR CITAS =====
  console.log('📅 Creando citas de ejemplo...');

  const today = new Date();

  // Obtener algunos servicios
  const serviciosSpa1 = await prisma.service.findMany({
    where: { branchId: spa1Branch1.id },
    take: 5,
  });

  // Cita 1: Completada y pagada
  const cita1 = await prisma.appointment.create({
    data: {
      clientId: cliente1Spa1.id,
      manicuristId: manicurist1Spa1Branch1.id,
      branchId: spa1Branch1.id,
      spaId: spa1.id,
      isScheduled: true,
      scheduledAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // Hace 2 días
      status: 'COMPLETED',
      notes: 'Cliente satisfecha con el resultado',
    },
  });

  // Servicios para cita 1
  await prisma.appointmentService.create({
    data: {
      appointmentId: cita1.id,
      serviceId: serviciosSpa1[0].id,
      manicuristId: manicurist1Spa1Branch1.id,
      price: serviciosSpa1[0].price,
      estimatedDuration: serviciosSpa1[0].duration,
      actualDuration: serviciosSpa1[0].duration, // Cita completada
    },
  });

  // Pago para cita 1 (obtener método de pago)
  const metodoPagoEfectivo = await prisma.paymentMethod.findFirst({
    where: { spaId: spa1.id, name: 'Efectivo' },
  });

  if (metodoPagoEfectivo) {
    await prisma.payment.create({
      data: {
        appointmentId: cita1.id,
        amount: serviciosSpa1[0].price,
        originalAmount: serviciosSpa1[0].price, // Sin descuento
        paymentMethodId: metodoPagoEfectivo.id,
        spaAccountId: metodoPagoEfectivo.spaAccountId, // Automático desde el método de pago!
        paidAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
        spaId: spa1.id,
        branchId: spa1Branch1.id,
      },
    });
  }

  console.log('✅ Cita 1 creada (completada y pagada)');

  // Cita 2: Confirmada para hoy
  const cita2 = await prisma.appointment.create({
    data: {
      clientId: cliente2Spa1.id,
      manicuristId: manicurist1Spa1Branch1.id,
      branchId: spa1Branch1.id,
      spaId: spa1.id,
      isScheduled: true,
      scheduledAt: new Date(today.setHours(14, 0, 0, 0)),
      status: 'SCHEDULED', // Estado correcto del enum
      notes: 'Quiere nail art con diseño floral',
    },
  });

  await prisma.appointmentService.create({
    data: {
      appointmentId: cita2.id,
      serviceId: serviciosSpa1[1].id,
      manicuristId: manicurist1Spa1Branch1.id,
      price: serviciosSpa1[1].price,
      estimatedDuration: serviciosSpa1[1].duration,
    },
  });

  console.log('✅ Cita 2 creada (confirmada para hoy)');

  // Cita 3: Programada para mañana
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const cita3 = await prisma.appointment.create({
    data: {
      clientId: cliente3Spa1.id,
      manicuristId: manicurist1Spa1Branch1.id,
      branchId: spa1Branch1.id,
      spaId: spa1.id,
      isScheduled: true,
      scheduledAt: tomorrow,
      status: 'SCHEDULED',
    },
  });

  await prisma.appointmentService.create({
    data: {
      appointmentId: cita3.id,
      serviceId: serviciosSpa1[2].id,
      manicuristId: manicurist1Spa1Branch1.id,
      price: serviciosSpa1[2].price,
      estimatedDuration: serviciosSpa1[2].duration,
    },
  });

  console.log('✅ Cita 3 creada (programada para mañana)');

  // Cita 4: Walk-in de hoy (sin cita previa)
  const cita4 = await prisma.appointment.create({
    data: {
      clientId: cliente4Spa1.id,
      manicuristId: manicurist1Spa1Branch2.id, // Corregido
      branchId: spa1Branch2.id,
      spaId: spa1.id,
      isScheduled: false, // Walk-in
      scheduledAt: new Date(),
      status: 'IN_PROGRESS',
      notes: 'Cliente sin cita previa',
    },
  });

  await prisma.appointmentService.create({
    data: {
      appointmentId: cita4.id,
      serviceId: serviciosSpa1[3].id,
      manicuristId: manicurist1Spa1Branch2.id, // Corregido
      price: serviciosSpa1[3].price,
      estimatedDuration: serviciosSpa1[3].duration,
    },
  });

  console.log('✅ Cita 4 creada (walk-in en progreso)');
  console.log('✅ Todas las citas creadas');

  // ===== CREAR GASTOS =====
  console.log('💸 Creando gastos de ejemplo...');

  // Gastos del Spa 1
  await prisma.expense.create({
    data: {
      name: 'Arriendo Local Principal',
      description: 'Pago mensual de arriendo del local principal',
      amount: 1200000,
      type: 'FIXED',
      category: 'RENT',
      frequency: 'MONTHLY',
      dueDate: new Date('2025-11-05'), // 5 de noviembre
      isPaid: false,
      isActive: true,
      spaId: spa1.id,
    },
  });

  const serviciosPublicosSpa1 = await prisma.expense.create({
    data: {
      name: 'Servicios Públicos Octubre',
      description: 'Luz, agua, gas e internet',
      amount: 350000,
      type: 'VARIABLE',
      category: 'UTILITIES',
      frequency: 'MONTHLY',
      dueDate: new Date('2025-10-20'),
      isPaid: true,
      paidAt: new Date('2025-10-18'),
      isActive: true,
      spaId: spa1.id,
    },
  });

  const suministrosSpa1 = await prisma.expense.create({
    data: {
      name: 'Compra de Suministros',
      description: 'Esmaltes, limas, algodón, acetona y otros materiales',
      amount: 450000,
      type: 'VARIABLE',
      category: 'SUPPLIES',
      frequency: 'MONTHLY',
      dueDate: new Date('2025-10-15'),
      isPaid: true,
      paidAt: new Date('2025-10-14'),
      isActive: true,
      spaId: spa1.id,
    },
  });

  await prisma.expense.create({
    data: {
      name: 'Publicidad Facebook Ads',
      description: 'Campaña de publicidad en redes sociales',
      amount: 200000,
      type: 'VARIABLE',
      category: 'MARKETING',
      frequency: 'MONTHLY',
      dueDate: new Date('2025-10-25'),
      isPaid: false,
      isActive: true,
      spaId: spa1.id,
    },
  });

  await prisma.expense.create({
    data: {
      name: 'Servicio de Limpieza',
      description: 'Limpieza profunda mensual del local',
      amount: 150000,
      type: 'FIXED',
      category: 'CLEANING',
      frequency: 'MONTHLY',
      dueDate: new Date('2025-11-01'),
      isPaid: false,
      isActive: true,
      spaId: spa1.id,
    },
  });

  console.log('✅ Gastos creados para Spa 1');

  // Gastos del Spa 2
  await prisma.expense.createMany({
    data: [
      {
        name: 'Arriendo Local Spa 2',
        description: 'Pago mensual de arriendo',
        amount: 1500000,
        type: 'FIXED',
        category: 'RENT',
        frequency: 'MONTHLY',
        dueDate: new Date('2025-11-05'),
        isPaid: false,
        isActive: true,
        spaId: spa2.id,
      },
      {
        name: 'Servicios Públicos Octubre',
        description: 'Servicios del mes',
        amount: 280000,
        type: 'VARIABLE',
        category: 'UTILITIES',
        frequency: 'MONTHLY',
        dueDate: new Date('2025-10-20'),
        isPaid: true,
        paidAt: new Date('2025-10-19'),
        isActive: true,
        spaId: spa2.id,
      },
    ],
  });

  console.log('✅ Gastos creados para Spa 2');

  // ===== CREAR PAGOS DE GASTOS =====
  console.log('💰 Registrando pagos de gastos...');

  // Pago de servicios públicos desde cuenta bancaria
  await prisma.expensePayment.create({
    data: {
      expenseId: serviciosPublicosSpa1.id,
      amount: 350000,
      paidAt: new Date('2025-10-18'),
      spaAccountId: cuentaBancolombiaAhorrosSpa1.id,
      reference: 'TRANSFER-2025-10-18-001',
      notes: 'Pago por transferencia bancaria',
      spaId: spa1.id,
    },
  });

  // Actualizar balance de la cuenta bancaria
  await prisma.spaAccount.update({
    where: { id: cuentaBancolombiaAhorrosSpa1.id },
    data: { balance: { decrement: 350000 } },
  });

  // Pago de suministros desde Nequi
  await prisma.expensePayment.create({
    data: {
      expenseId: suministrosSpa1.id,
      amount: 450000,
      paidAt: new Date('2025-10-14'),
      spaAccountId: cuentaNequiNegocioSpa1.id,
      reference: 'NEQUI-2025-10-14-001',
      notes: 'Pago por Nequi al proveedor',
      spaId: spa1.id,
    },
  });

  // Actualizar balance de Nequi
  await prisma.spaAccount.update({
    where: { id: cuentaNequiNegocioSpa1.id },
    data: { balance: { decrement: 450000 } },
  });

  console.log('✅ Pagos de gastos registrados');

  console.log('\n🎉 Datos iniciales creados exitosamente!\n');

  console.log('📋 RESUMEN DE DATOS CREADOS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('👥 USUARIOS:');
  console.log('  SUPER_ADMIN: jlmonroy13@gmail.com\n');
  console.log('  === SPA 1 ===');
  console.log('  SPA_ADMIN: jlmonroy13+spa1@gmail.com');
  console.log('  BRANCH_ADMIN (Sede 1): jlmonroy13+spa1branch1@gmail.com');
  console.log(
    '  MANICURIST (Sede 1): jlmonroy13+spa1branch1manicurista@gmail.com'
  );
  console.log('  BRANCH_ADMIN (Sede 2): jlmonroy13+spa1branch2@gmail.com');
  console.log(
    '  MANICURIST (Sede 2): jlmonroy13+spa1branch2manicurista@gmail.com\n'
  );
  console.log('  === SPA 2 ===');
  console.log('  SPA_ADMIN: jlmonroy13+spa2@gmail.com');
  console.log('  BRANCH_ADMIN (Sede 1): jlmonroy13+spa2branch1@gmail.com');
  console.log(
    '  MANICURIST (Sede 1): jlmonroy13+spa2branch1manicurista@gmail.com'
  );
  console.log('  BRANCH_ADMIN (Sede 2): jlmonroy13+spa2branch2@gmail.com');
  console.log(
    '  MANICURIST (Sede 2): jlmonroy13+spa2branch2manicurista@gmail.com\n'
  );

  console.log('💳 MÉTODOS DE PAGO (clientes):');
  console.log(
    '  Spa 1: 6 métodos (Efectivo → Caja, Nequi → Cuenta Nequi, etc.)'
  );
  console.log('  Spa 2: 4 métodos');
  console.log('  ✨ Cada método está asociado a una cuenta del spa\n');

  console.log('🏦 CUENTAS DEL SPA:');
  console.log('  Spa 1: 5 cuentas');
  console.log('    - Caja Principal: $500,000');
  console.log(
    '    - Cuenta Bancolombia Ahorros: $2,150,000 (después de gastos)'
  );
  console.log('    - Nequi Negocio: $400,000 (después de gastos)');
  console.log('    - Daviplata Empresarial: $650,000');
  console.log('    - Caja Chica Sede Principal: $200,000');
  console.log('  Spa 2: 3 cuentas');
  console.log('    - Caja Principal: $400,000');
  console.log('    - Cuenta Davivienda: $1,800,000');
  console.log('    - Nequi Negocio: $550,000\n');

  console.log('👥 CLIENTES:');
  console.log('  Spa 1: 4 clientes registrados');
  console.log('  Spa 2: 2 clientes registrados\n');

  console.log('📅 CITAS:');
  console.log('  4 citas creadas para Spa 1:');
  console.log('    - 1 completada y pagada (hace 2 días)');
  console.log('    - 1 confirmada para hoy');
  console.log('    - 1 programada para mañana');
  console.log('    - 1 walk-in en progreso');
  console.log(
    '  ✨ Los pagos se asocian automáticamente a la cuenta del método de pago\n'
  );

  console.log('💸 GASTOS:');
  console.log('  Spa 1: 5 gastos registrados');
  console.log(
    '    - Pagados: Servicios Públicos ($350,000), Suministros ($450,000)'
  );
  console.log(
    '    - Pendientes: Arriendo ($1,200,000), Marketing ($200,000), Limpieza ($150,000)'
  );
  console.log('  Spa 2: 2 gastos registrados');
  console.log('    - Pagados: Servicios Públicos ($280,000)');
  console.log('    - Pendientes: Arriendo ($1,500,000)\n');

  console.log('🛠️ SERVICIOS:');
  console.log(
    '  20 servicios creados para cada sede (4 sedes × 20 = 80 servicios totales)\n'
  );

  console.log('💅 MANICURISTAS:');
  console.log(
    '  4 manicuristas con servicios asignados y horarios configurados\n'
  );

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Todos los datos de prueba han sido creados exitosamente!');
}

main().finally(() => prisma.$disconnect());
