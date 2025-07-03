const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function testPrismaConnection() {
  try {
    console.log("🔌 Testing Prisma connection...");

    // Test basic connection
    await prisma.$connect();
    console.log("✅ Prisma connected successfully");

    // Test a simple query
    const spaCount = await prisma.spa.count();
    console.log(`✅ Database accessible - Found ${spaCount} spas`);

    // Test all models are accessible
    console.log("\n🧪 Testing all models...");

    await prisma.spa.findFirst();
    console.log("✅ Spa model");

    await prisma.service.findFirst();
    console.log("✅ Service model");

    await prisma.manicurist.findFirst();
    console.log("✅ Manicurist model");

    await prisma.client.findFirst();
    console.log("✅ Client model");

    await prisma.appointment.findFirst();
    console.log("✅ Appointment model");

    await prisma.bookingLink.findFirst();
    console.log("✅ BookingLink model");

    await prisma.cashRegister.findFirst();
    console.log("✅ CashRegister model");

    await prisma.salesGoal.findFirst();
    console.log("✅ SalesGoal model");

    await prisma.clientServiceHistory.findFirst();
    console.log("✅ ClientServiceHistory model");

    await prisma.manicuristSchedule.findFirst();
    console.log("✅ ManicuristSchedule model");

    await prisma.manicuristAvailability.findFirst();
    console.log("✅ ManicuristAvailability model");

    await prisma.timeSlot.findFirst();
    console.log("✅ TimeSlot model");

    await prisma.manicuristServiceDuration.findFirst();
    console.log("✅ ManicuristServiceDuration model");

    await prisma.salesGoalProgress.findFirst();
    console.log("✅ SalesGoalProgress model");

    await prisma.appointmentApprovalHistory.findFirst();
    console.log("✅ AppointmentApprovalHistory model");

    await prisma.preConfirmationReminder.findFirst();
    console.log("✅ PreConfirmationReminder model");

    await prisma.cashRegisterShift.findFirst();
    console.log("✅ CashRegisterShift model");

    await prisma.cashRegisterTransaction.findFirst();
    console.log("✅ CashRegisterTransaction model");

    await prisma.bookingLinkService.findFirst();
    console.log("✅ BookingLinkService model");

    console.log("\n🎉 All models are working correctly!");
    console.log(
      "✅ Migration and Prisma client generation completed successfully!"
    );
  } catch (error) {
    console.error("❌ Error testing Prisma:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();
