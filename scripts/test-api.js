// @ts-check
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function testApiRoutes() {
  try {
    console.log("🧪 Testing API routes...");

    // First, let's create a test spa
    console.log("\n1. Creating test spa...");
    const testSpa = await prisma.spa.create({
      data: {
        name: "Test Spa",
        slug: "test-spa",
        address: "123 Test Street",
        phone: "555-0123",
        email: "test@spa.com",
        isActive: true,
      },
    });
    console.log("✅ Test spa created:", testSpa.id);

    // Create a test service
    console.log("\n2. Creating test service...");
    const testService = await prisma.service.create({
      data: {
        name: "Test Manicure",
        type: "MANICURE",
        price: 5000,
        duration: 60,
        isActive: true,
        spaId: testSpa.id,
      },
    });
    console.log("✅ Test service created:", testService.id);

    // Create a test client
    console.log("\n3. Creating test client...");
    const testClient = await prisma.client.create({
      data: {
        name: "Test Client",
        phone: "555-0124",
        email: "client@test.com",
        spaId: testSpa.id,
      },
    });
    console.log("✅ Test client created:", testClient.id);

    // Create a test manicurist
    console.log("\n4. Creating test manicurist...");
    const testManicurist = await prisma.manicurist.create({
      data: {
        name: "Test Manicurist",
        phone: "555-0125",
        email: "manicurist@test.com",
        specialty: "MANICURE",
        commission: 0.5,
        isActive: true,
        spaId: testSpa.id,
      },
    });
    console.log("✅ Test manicurist created:", testManicurist.id);

    // Test API endpoints
    console.log("\n5. Testing API endpoints...");

    // Test GET /api/spas
    const spasResponse = await fetch(
      `http://localhost:3000/api/spas?spaId=${testSpa.id}`
    );
    if (spasResponse.ok) {
      const spas = await spasResponse.json();
      console.log("✅ GET /api/spas:", spas.length, "spas found");
    } else {
      console.log("❌ GET /api/spas failed:", spasResponse.status);
    }

    // Test GET /api/services
    const servicesResponse = await fetch(
      `http://localhost:3000/api/services?spaId=${testSpa.id}`
    );
    if (servicesResponse.ok) {
      const services = await servicesResponse.json();
      console.log("✅ GET /api/services:", services.length, "services found");
    } else {
      console.log("❌ GET /api/services failed:", servicesResponse.status);
    }

    // Test GET /api/clients
    const clientsResponse = await fetch(
      `http://localhost:3000/api/clients?spaId=${testSpa.id}`
    );
    if (clientsResponse.ok) {
      const clients = await clientsResponse.json();
      console.log("✅ GET /api/clients:", clients.length, "clients found");
    } else {
      console.log("❌ GET /api/clients failed:", clientsResponse.status);
    }

    // Test GET /api/manicurists
    const manicuristsResponse = await fetch(
      `http://localhost:3000/api/manicurists?spaId=${testSpa.id}`
    );
    if (manicuristsResponse.ok) {
      const manicurists = await manicuristsResponse.json();
      console.log(
        "✅ GET /api/manicurists:",
        manicurists.length,
        "manicurists found"
      );
    } else {
      console.log(
        "❌ GET /api/manicurists failed:",
        manicuristsResponse.status
      );
    }

    // Test POST /api/appointments
    console.log("\n6. Testing appointment creation...");
    const appointmentData = {
      clientId: testClient.id,
      manicuristId: testManicurist.id,
      isScheduled: true,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      status: "SCHEDULED",
      notes: "Test appointment",
      spaId: testSpa.id,
      services: [
        {
          serviceId: testService.id,
          manicuristId: testManicurist.id,
          price: 5000,
        },
      ],
    };

    const appointmentResponse = await fetch(
      "http://localhost:3000/api/appointments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      }
    );

    if (appointmentResponse.ok) {
      const appointment = await appointmentResponse.json();
      console.log(
        "✅ POST /api/appointments: Appointment created:",
        appointment.id
      );
    } else {
      const error = await appointmentResponse.text();
      console.log(
        "❌ POST /api/appointments failed:",
        appointmentResponse.status,
        error
      );
    }

    console.log("\n🎉 API routes test completed!");
  } catch (error) {
    console.error("❌ Error testing API routes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch("http://localhost:3000/api/spas");
    if (response.ok) {
      console.log("✅ Server is running on http://localhost:3000");
      await testApiRoutes();
    } else {
      console.log("❌ Server is not responding correctly");
      console.log("Please start the development server with: npm run dev");
    }
  } catch {
    console.log("❌ Server is not running");
    console.log("Please start the development server with: npm run dev");
  }
}

checkServer();
