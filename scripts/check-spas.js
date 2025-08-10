const { PrismaClient } = require("../src/generated/prisma");

const prisma = new PrismaClient();

async function checkSpas() {
  try {
    console.log("🔍 Checking spas in database...");

    // Get all spas with counts
    const spas = await prisma.spa.findMany({
      include: {
        _count: {
          select: {
            users: true,
            clients: true,
            appointments: true,
            services: true,
          },
        },
      },
    });

    console.log(`✅ Found ${spas.length} spas:`);

    spas.forEach((spa, index) => {
      console.log(`\n${index + 1}. Spa: ${spa.name}`);
      console.log(`   ID: ${spa.id}`);
      console.log(`   Slug: ${spa.slug}`);
      console.log(`   Email: ${spa.email || "N/A"}`);
      console.log(`   Phone: ${spa.phone || "N/A"}`);
      console.log(`   Active: ${spa.isActive}`);
      console.log(`   Created: ${spa.createdAt}`);
      console.log(`   Counts:`);
      console.log(`     - Users: ${spa._count.users}`);
      console.log(`     - Clients: ${spa._count.clients}`);
      console.log(`     - Appointments: ${spa._count.appointments}`);
      console.log(`     - Services: ${spa._count.services}`);
    });

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isSuperAdmin: true,
        spaId: true,
      },
    });

    console.log(`\n👥 Found ${users.length} users:`);
    users.forEach((user, index) => {
      const userType = user.isSuperAdmin
        ? user.spaId
          ? "Super Admin (with spa)"
          : "Super Admin (no spa)"
        : user.spaId
        ? "Regular User"
        : "User (no spa)";

      console.log(`\n${index + 1}. User: ${user.name || "N/A"}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Type: ${userType}`);
      console.log(`   Super Admin: ${user.isSuperAdmin}`);
      console.log(`   Spa ID: ${user.spaId || "N/A"}`);
    });

    // Summary
    const superAdmins = users.filter((u) => u.isSuperAdmin);
    const regularUsers = users.filter((u) => !u.isSuperAdmin);
    const usersWithSpa = users.filter((u) => u.spaId);
    const usersWithoutSpa = users.filter((u) => !u.spaId);

    console.log(`\n📊 Summary:`);
    console.log(`   - Total users: ${users.length}`);
    console.log(`   - Super admins: ${superAdmins.length}`);
    console.log(`   - Regular users: ${regularUsers.length}`);
    console.log(`   - Users with spa: ${usersWithSpa.length}`);
    console.log(`   - Users without spa: ${usersWithoutSpa.length}`);
  } catch (error) {
    console.error("❌ Error checking spas:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSpas();
