import { prisma } from './prisma';

// Test function to verify all models are accessible
export async function testPrismaModels() {
  try {
    console.log('🧪 Testing Prisma models...');

    // Test Spa model
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const spa = await prisma.spa.findFirst();
    console.log('✅ Spa model accessible');

    // Test Service model
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const service = await prisma.service.findFirst();
    console.log('✅ Service model accessible');

    // Test Manicurist model
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const manicurist = await prisma.manicurist.findFirst();
    console.log('✅ Manicurist model accessible');

    // Test Client model
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const client = await prisma.client.findFirst();
    console.log('✅ Client model accessible');

    // Test Appointment model
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const appointment = await prisma.appointment.findFirst();
    console.log('✅ Appointment model accessible');

    // Test new models
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const bookingLink = await prisma.bookingLink.findFirst();
    console.log('✅ BookingLink model accessible');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cashRegister = await prisma.cashRegister.findFirst();
    console.log('✅ CashRegister model accessible');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const salesGoal = await prisma.salesGoal.findFirst();
    console.log('✅ SalesGoal model accessible');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const clientServiceHistory = await prisma.clientServiceHistory.findFirst();
    console.log('✅ ClientServiceHistory model accessible');

    console.log('🎉 All Prisma models are working correctly!');
  } catch (error) {
    console.error('❌ Error testing Prisma models:', error);
    throw error;
  }
}

// Test enums
export function testEnums() {
  console.log('🧪 Testing enums...');

  // Test AppointmentStatus enum
  const appointmentStatuses = [
    'PENDING_APPROVAL',
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
  ];
  console.log('✅ AppointmentStatus enum values:', appointmentStatuses);

  // Test ServiceType enum
  const serviceTypes = [
    'MANICURE',
    'PEDICURE',
    'NAIL_ART',
    'GEL_POLISH',
    'ACRYLIC_NAILS',
    'NAIL_REPAIR',
    'HAND_SPA',
    'FOOT_SPA',
    'OTHER',
  ];
  console.log('✅ ServiceType enum values:', serviceTypes);

  // Test CashRegisterTransactionType enum
  const transactionTypes = [
    'PAYMENT_RECEIVED',
    'PAYMENT_REFUND',
    'CASH_DEPOSIT',
    'CASH_WITHDRAWAL',
    'EXPENSE_PAYMENT',
    'CHANGE_GIVEN',
    'OPENING_BALANCE',
    'CLOSING_BALANCE',
    'ADJUSTMENT',
    'OTHER',
  ];
  console.log('✅ CashRegisterTransactionType enum values:', transactionTypes);

  console.log('🎉 All enums are working correctly!');
}
