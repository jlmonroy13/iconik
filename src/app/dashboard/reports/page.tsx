import { prisma } from '@/lib/prisma';
import { RevenueStats } from './components/RevenueStats';
import { ServiceAnalytics } from './components/ServiceAnalytics';
import { ManicuristPerformance } from './components/ManicuristPerformance';
import { ClientInsights } from './components/ClientInsights';
import { DateRangePicker } from './components/DateRangePicker';
import { ExportOptions } from './components/ExportOptions';
import { PageTransition, FadeIn, EmptyState } from '@/components/ui';
import { BarChart2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reportes - Iconik',
  description:
    'Analiza el rendimiento de tu spa de uñas con reportes detallados de ingresos, servicios, manicuristas y clientes.',
};

async function getReportsData() {
  // Get the first spa for now (later we'll get from session)
  const spa = await prisma.spa.findFirst();

  if (!spa) {
    return {
      services: [],
      clients: [],
      manicurists: [],
      stats: {
        totalRevenue: 0,
        totalServices: 0,
        totalClients: 0,
        averageRating: 0,
        monthlyGrowth: 0,
      },
    };
  }

  const [appointmentServices, clients, manicurists] = await Promise.all([
    // Get all appointment services with related data
    prisma.appointmentService.findMany({
      where: {
        appointment: { spaId: spa.id },
      },
      include: {
        appointment: {
          include: {
            client: true,
          },
        },
        service: true,
        manicurist: true,
        feedback: true,
      },
      orderBy: { createdAt: 'desc' },
    }),

    // Get all clients with appointments
    prisma.client.findMany({
      where: { spaId: spa.id },
      include: {
        appointments: {
          include: {
            services: {
              include: {
                service: true,
                manicurist: true,
                feedback: true,
              },
            },
          },
        },
      },
    }),

    // Get all manicurists with appointment services
    prisma.manicurist.findMany({
      where: { spaId: spa.id },
      include: {
        appointmentServices: {
          include: {
            appointment: {
              include: {
                client: true,
              },
            },
            service: true,
            feedback: true,
          },
        },
      },
    }),
  ]);

  // Calculate comprehensive stats from appointment services
  const totalRevenue = appointmentServices.reduce(
    (sum, service) => sum + service.price,
    0
  );
  const totalServices = appointmentServices.length;
  const totalClients = clients.length;

  // Calculate average rating from feedback
  const servicesWithFeedback = appointmentServices.filter(s => s.feedback);
  const averageRating =
    servicesWithFeedback.length > 0
      ? servicesWithFeedback.reduce(
          (sum, service) => sum + service.feedback!.workQualityRating,
          0
        ) / servicesWithFeedback.length
      : 0;

  // Calculate monthly growth (simplified)
  const currentMonth = new Date().getMonth();
  const lastMonth = new Date().getMonth() - 1;
  const currentMonthRevenue = appointmentServices
    .filter(s => new Date(s.createdAt).getMonth() === currentMonth)
    .reduce((sum, s) => sum + s.price, 0);
  const lastMonthRevenue = appointmentServices
    .filter(s => new Date(s.createdAt).getMonth() === lastMonth)
    .reduce((sum, s) => sum + s.price, 0);
  const monthlyGrowth =
    lastMonthRevenue > 0
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

  const stats = {
    totalRevenue,
    totalServices,
    totalClients,
    averageRating: Math.round(averageRating * 10) / 10,
    monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
  };

  return {
    services: appointmentServices,
    clients,
    manicurists,
    stats,
  };
}

export default async function ReportsPage() {
  const { services, clients, manicurists, stats } = await getReportsData();

  const hasData =
    services.length > 0 || clients.length > 0 || manicurists.length > 0;

  return (
    <PageTransition className='h-full'>
      <div className='flex h-full flex-col'>
        {/* Fixed Header */}
        <div className='flex-shrink-0'>
          <FadeIn>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6'>
              <div>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
                  Reportes y Analíticas
                </h1>
                <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                  Visualiza el rendimiento y las métricas clave de tu spa.
                </p>
              </div>
              <div className='flex flex-col sm:flex-row gap-3'>
                <DateRangePicker />
                <ExportOptions />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Scrollable Content */}
        <div className='flex-grow overflow-y-auto pr-2 min-h-0'>
          {hasData ? (
            <div className='space-y-6'>
              <FadeIn delay={200}>
                <RevenueStats stats={stats as any} />
              </FadeIn>

              <FadeIn delay={400}>
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
                  <div className='p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700'>
                    <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white'>
                      Análisis de Servicios
                    </h2>
                  </div>
                  <div className='p-3 sm:p-4 lg:p-6'>
                    <ServiceAnalytics services={services as any} />
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={600}>
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
                  <div className='p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white'>
                        Rendimiento de Manicuristas
                      </h2>
                    </div>
                  </div>
                  <div className='p-3 sm:p-4 lg:p-6'>
                    <ManicuristPerformance manicurists={manicurists as any} />
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={800}>
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm'>
                  <div className='p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700'>
                    <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-white'>
                      Insights de Clientes
                    </h2>
                  </div>
                  <div className='p-3 sm:p-4 lg:p-6'>
                    <ClientInsights clients={clients as any} />
                  </div>
                </div>
              </FadeIn>
            </div>
          ) : (
            <div className='h-full'>
              <FadeIn delay={200}>
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full'>
                  <EmptyState
                    title='No hay datos para mostrar'
                    description='Comienza agregando servicios, clientes y manicuristas para generar reportes.'
                    icon={
                      <BarChart2 className='w-12 h-12 mx-auto text-gray-400' />
                    }
                  />
                </div>
              </FadeIn>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
