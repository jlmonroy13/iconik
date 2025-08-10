'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Input,
  Button,
  useNotifications,
  Card,
  CardContent,
} from '@/components/ui';
import {
  superAdminCreateSpaSchema,
  SuperAdminCreateSpaFormData,
} from './schemas';
import { API_ROUTES } from '@/lib/constants/routes';
import { Plus, Building2, Users, Calendar, DollarSign } from 'lucide-react';

interface Spa {
  id: string;
  name: string;
  slug: string;
  email?: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    users: number;
    clients: number;
    appointments: number;
    services: number;
  };
}

export default function SuperAdminDashboardClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [spas, setSpas] = useState<Spa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SuperAdminCreateSpaFormData>({
    resolver: zodResolver(superAdminCreateSpaSchema),
    defaultValues: {
      spaName: '',
      spaSlug: '',
      spaEmail: '',
      adminName: '',
      adminEmail: '',
    },
  });

  // Fetch existing spas
  useEffect(() => {
    const fetchSpas = async () => {
      try {
        console.log('🔍 Fetching spas...');

        // First check if we have a valid session
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();
        console.log('🔐 Session data:', sessionData);

        if (!sessionData?.user) {
          console.error('❌ No valid session found');
          return;
        }

        const response = await fetch('/api/spas');
        console.log('📡 Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('📦 Response data:', data);
          setSpas(Array.isArray(data) ? data : []);
        } else {
          const errorData = await response.json();
          console.error(
            '❌ Error fetching spas:',
            response.status,
            response.statusText,
            errorData
          );
        }
      } catch (error) {
        console.error('❌ Error fetching spas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure session is established
    const timer = setTimeout(fetchSpas, 1000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: SuperAdminCreateSpaFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(API_ROUTES.DASHBOARD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (!response.ok) {
        showError(
          'Error',
          res.error || 'Error desconocido al crear el spa o el administrador.'
        );
      } else {
        showSuccess(
          'Éxito',
          res.message || 'Spa y administrador creados exitosamente.'
        );
        reset();
        setShowCreateForm(false);
        // Refresh spas list
        window.location.reload();
      }
    } catch {
      showError(
        'Error',
        'Error de red o del servidor. Por favor, intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSpaClick = (spaId: string) => {
    // Redirect to spa dashboard
    window.location.href = `/dashboard/${spaId}`;
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
        <div className='text-white text-xl'>Cargando spas...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-white mb-2'>
            Super Admin Dashboard
          </h1>
          <p className='text-gray-300'>Gestiona todos los spas del sistema</p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <Card className='bg-white/10 border-white/20'>
            <CardContent className='p-4'>
              <div className='flex items-center'>
                <Building2 className='w-8 h-8 text-blue-400 mr-3' />
                <div>
                  <p className='text-gray-300 text-sm'>Total Spas</p>
                  <p className='text-white text-2xl font-bold'>{spas.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-white/10 border-white/20'>
            <CardContent className='p-4'>
              <div className='flex items-center'>
                <Users className='w-8 h-8 text-green-400 mr-3' />
                <div>
                  <p className='text-gray-300 text-sm'>Usuarios Activos</p>
                  <p className='text-white text-2xl font-bold'>
                    {spas.reduce(
                      (total, spa) => total + (spa._count?.users || 0),
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-white/10 border-white/20'>
            <CardContent className='p-4'>
              <div className='flex items-center'>
                <Calendar className='w-8 h-8 text-purple-400 mr-3' />
                <div>
                  <p className='text-gray-300 text-sm'>Citas Totales</p>
                  <p className='text-white text-2xl font-bold'>
                    {spas.reduce(
                      (total, spa) => total + (spa._count?.appointments || 0),
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className='bg-white/10 border-white/20'>
            <CardContent className='p-4'>
              <div className='flex items-center'>
                <DollarSign className='w-8 h-8 text-yellow-400 mr-3' />
                <div>
                  <p className='text-gray-300 text-sm'>Servicios</p>
                  <p className='text-white text-2xl font-bold'>
                    {spas.reduce(
                      (total, spa) => total + (spa._count?.services || 0),
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spas List */}
        <div className='mb-8'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-white'>Spas del Sistema</h2>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className='bg-purple-600 hover:bg-purple-700'
            >
              <Plus className='w-4 h-4 mr-2' />
              {showCreateForm ? 'Cancelar' : 'Crear Nuevo Spa'}
            </Button>
          </div>

          {spas.length === 0 ? (
            <Card className='bg-white/10 border-white/20'>
              <CardContent className='p-8 text-center'>
                <Building2 className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-xl font-semibold text-white mb-2'>
                  No hay spas creados
                </h3>
                <p className='text-gray-300 mb-4'>
                  Crea el primer spa para comenzar
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className='bg-purple-600 hover:bg-purple-700'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Crear Primer Spa
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {spas.map(spa => (
                <Card
                  key={spa.id}
                  className='bg-white/10 border-white/20 hover:bg-white/20 transition-colors cursor-pointer'
                  onClick={() => handleSpaClick(spa.id)}
                >
                  <CardContent className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-xl font-semibold text-white mb-1'>
                          {spa.name}
                        </h3>
                        <p className='text-gray-300 text-sm'>/{spa.slug}</p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${spa.isActive ? 'bg-green-400' : 'bg-red-400'}`}
                      />
                    </div>

                    <div className='space-y-2 mb-4'>
                      {spa.email && (
                        <p className='text-gray-300 text-sm'>{spa.email}</p>
                      )}
                      {spa.phone && (
                        <p className='text-gray-300 text-sm'>{spa.phone}</p>
                      )}
                    </div>

                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div className='text-center'>
                        <p className='text-gray-300'>Usuarios</p>
                        <p className='text-white font-semibold'>
                          {spa._count?.users || 0}
                        </p>
                      </div>
                      <div className='text-center'>
                        <p className='text-gray-300'>Clientes</p>
                        <p className='text-white font-semibold'>
                          {spa._count?.clients || 0}
                        </p>
                      </div>
                      <div className='text-center'>
                        <p className='text-gray-300'>Citas</p>
                        <p className='text-white font-semibold'>
                          {spa._count?.appointments || 0}
                        </p>
                      </div>
                      <div className='text-center'>
                        <p className='text-gray-300'>Servicios</p>
                        <p className='text-white font-semibold'>
                          {spa._count?.services || 0}
                        </p>
                      </div>
                    </div>

                    <div className='text-center'>
                      <Button
                        variant='outline'
                        className='w-full border-white/20 text-white hover:bg-white/10'
                        onClick={e => {
                          e.stopPropagation();
                          handleSpaClick(spa.id);
                        }}
                      >
                        Acceder al Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Create Spa Form */}
        {showCreateForm && (
          <Card className='bg-white/10 border-white/20'>
            <CardContent className='p-8'>
              <h2 className='text-2xl font-bold text-white mb-6'>
                Crear Nuevo Spa
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h3 className='text-lg font-semibold mb-4 text-white'>
                      Información del Spa
                    </h3>
                    <Input
                      label='Nombre del Spa'
                      {...register('spaName')}
                      error={errors.spaName?.message}
                    />
                    <Input
                      label='Slug del Spa'
                      {...register('spaSlug')}
                      error={errors.spaSlug?.message}
                    />
                    <Input
                      label='Correo electrónico del spa (opcional)'
                      type='email'
                      {...register('spaEmail')}
                      error={errors.spaEmail?.message}
                      placeholder='opcional'
                    />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold mb-4 text-white'>
                      Administrador del Spa
                    </h3>
                    <Input
                      label='Nombre del administrador'
                      {...register('adminName')}
                      error={errors.adminName?.message}
                    />
                    <Input
                      label='Correo electrónico del administrador'
                      type='email'
                      {...register('adminEmail')}
                      error={errors.adminEmail?.message}
                    />
                  </div>
                </div>
                <div className='flex gap-4'>
                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='flex-1 bg-purple-600 hover:bg-purple-700'
                  >
                    {isSubmitting ? 'Creando...' : 'Crear Spa y Administrador'}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setShowCreateForm(false)}
                    className='border-white/20 text-white hover:bg-white/10'
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
