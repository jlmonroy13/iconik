'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
  Switch,
} from '@/components/ui';
import { Save, AlertCircle } from 'lucide-react';
import {
  updateBranchInfoSchema,
  updateBranchSettingsSchema,
  type UpdateBranchInfoData,
  type UpdateBranchSettingsData,
} from '@/types/forms';
import { updateBranchInfo, updateBranchAdvancedSettings } from '../actions';
import type { BranchWithSettings } from '../queries';

interface SettingsClientProps {
  branch: BranchWithSettings;
  spaId: string;
  branchId: string;
}

export function SettingsClient({
  branch,
  spaId,
  branchId,
}: SettingsClientProps) {
  const router = useRouter();
  const [isSubmittingBasic, setIsSubmittingBasic] = useState(false);
  const [isSubmittingAdvanced, setIsSubmittingAdvanced] = useState(false);
  const [basicError, setBasicError] = useState<string | null>(null);
  const [advancedError, setAdvancedError] = useState<string | null>(null);
  const [basicSuccess, setBasicSuccess] = useState(false);
  const [advancedSuccess, setAdvancedSuccess] = useState(false);

  // Form for basic information
  const basicForm = useForm<UpdateBranchInfoData>({
    resolver: zodResolver(updateBranchInfoSchema),
    defaultValues: {
      name: branch.name,
      description: branch.description || '',
      address: branch.address,
      phone: branch.phone || '',
      email: branch.email || '',
      openingTime: branch.openingTime || '',
      closingTime: branch.closingTime || '',
      isActive: branch.isActive,
      invoicePrefix: branch.invoicePrefix || '',
    },
  });

  // Form for advanced settings
  const advancedForm = useForm<UpdateBranchSettingsData>({
    resolver: zodResolver(updateBranchSettingsSchema),
    defaultValues: {
      customTaxRate: branch.settings?.customTaxRate || undefined,
      customOperatingHours: branch.settings?.customOperatingHours || false,
      enableAllServices: branch.settings?.enableAllServices ?? true,
      enableAllManicurists: branch.settings?.enableAllManicurists ?? true,
      allowNewClients: branch.settings?.allowNewClients ?? true,
      allowWalkIns: branch.settings?.allowWalkIns ?? true,
      useSpaDianSettings: branch.settings?.useSpaDianSettings ?? true,
    },
  });

  const onSubmitBasic = async (data: UpdateBranchInfoData) => {
    setIsSubmittingBasic(true);
    setBasicError(null);
    setBasicSuccess(false);

    try {
      const result = await updateBranchInfo(branchId, spaId, data);

      if (result.success) {
        setBasicSuccess(true);
        router.refresh();
        setTimeout(() => setBasicSuccess(false), 3000);
      } else {
        setBasicError(result.error || 'Error al actualizar la información');
      }
    } catch (err) {
      setBasicError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsSubmittingBasic(false);
    }
  };

  const onSubmitAdvanced = async (data: UpdateBranchSettingsData) => {
    setIsSubmittingAdvanced(true);
    setAdvancedError(null);
    setAdvancedSuccess(false);

    try {
      const result = await updateBranchAdvancedSettings(branchId, spaId, data);

      if (result.success) {
        setAdvancedSuccess(true);
        router.refresh();
        setTimeout(() => setAdvancedSuccess(false), 3000);
      } else {
        setAdvancedError(
          result.error || 'Error al actualizar la configuración'
        );
      }
    } catch (err) {
      setAdvancedError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsSubmittingAdvanced(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración de Sede
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Configura los parámetros específicos de{' '}
          <span className="font-medium">{branch.name}</span>
        </p>
      </div>

      {/* Basic Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={basicForm.handleSubmit(onSubmitBasic)}
            className="space-y-6"
          >
            {basicError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {basicError}
                </p>
              </div>
            )}

            {basicSuccess && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-300 text-sm">
                  ✓ Información actualizada correctamente
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <Label htmlFor="name">Nombre de la Sede *</Label>
                <Input
                  id="name"
                  {...basicForm.register('name')}
                  placeholder="Ej: Sede Centro"
                  error={basicForm.formState.errors.name?.message}
                />
              </div>

              {/* Invoice Prefix */}
              <div>
                <Label htmlFor="invoicePrefix">Prefijo de Factura</Label>
                <Input
                  id="invoicePrefix"
                  {...basicForm.register('invoicePrefix')}
                  placeholder="Ej: FAC-CENTRO"
                  error={basicForm.formState.errors.invoicePrefix?.message}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Prefijo personalizado para facturas de esta sede
                </p>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  {...basicForm.register('address')}
                  placeholder="Dirección completa de la sede"
                  error={basicForm.formState.errors.address?.message}
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  {...basicForm.register('phone')}
                  placeholder="Ej: 3001234567"
                  error={basicForm.formState.errors.phone?.message}
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...basicForm.register('email')}
                  placeholder="correo@sede.com"
                  error={basicForm.formState.errors.email?.message}
                />
              </div>

              {/* Opening Time */}
              <div>
                <Label htmlFor="openingTime">Hora de Apertura</Label>
                <Input
                  id="openingTime"
                  type="time"
                  {...basicForm.register('openingTime')}
                  error={basicForm.formState.errors.openingTime?.message}
                />
                {!basicForm.watch('openingTime') && branch.spa.openingTime && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Por defecto: {branch.spa.openingTime}
                  </p>
                )}
              </div>

              {/* Closing Time */}
              <div>
                <Label htmlFor="closingTime">Hora de Cierre</Label>
                <Input
                  id="closingTime"
                  type="time"
                  {...basicForm.register('closingTime')}
                  error={basicForm.formState.errors.closingTime?.message}
                />
                {!basicForm.watch('closingTime') && branch.spa.closingTime && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Por defecto: {branch.spa.closingTime}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...basicForm.register('description')}
                  placeholder="Descripción opcional de la sede..."
                  rows={3}
                  error={basicForm.formState.errors.description?.message}
                />
              </div>

              {/* Is Active */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div>
                    <Label className="text-base">Estado de la Sede</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Las sedes inactivas no aparecerán en el sistema
                    </p>
                  </div>
                  <Switch
                    checked={basicForm.watch('isActive')}
                    onCheckedChange={value =>
                      basicForm.setValue('isActive', value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                disabled={isSubmittingBasic}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmittingBasic ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Advanced Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración Avanzada</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={advancedForm.handleSubmit(onSubmitAdvanced)}
            className="space-y-6"
          >
            {advancedError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {advancedError}
                </p>
              </div>
            )}

            {advancedSuccess && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-300 text-sm">
                  ✓ Configuración actualizada correctamente
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Custom Tax Rate */}
              <div>
                <Label htmlFor="customTaxRate">
                  Tasa de Impuesto Personalizada (%)
                </Label>
                <Input
                  id="customTaxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...advancedForm.register('customTaxRate', {
                    valueAsNumber: true,
                  })}
                  placeholder="Ej: 19"
                  error={advancedForm.formState.errors.customTaxRate?.message}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Deja vacío para usar la tasa del spa principal
                </p>
              </div>

              {/* Custom Operating Hours */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Label className="text-base">Horarios Personalizados</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Usar horarios específicos diferentes al spa principal
                  </p>
                </div>
                <Switch
                  checked={advancedForm.watch('customOperatingHours')}
                  onCheckedChange={value =>
                    advancedForm.setValue('customOperatingHours', value)
                  }
                />
              </div>

              {/* Enable All Services */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Label className="text-base">
                    Habilitar Todos los Servicios
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Permitir todos los servicios del spa en esta sede
                  </p>
                </div>
                <Switch
                  checked={advancedForm.watch('enableAllServices')}
                  onCheckedChange={value =>
                    advancedForm.setValue('enableAllServices', value)
                  }
                />
              </div>

              {/* Enable All Manicurists */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Label className="text-base">
                    Habilitar Todas las Manicuristas
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Permitir todas las manicuristas del spa en esta sede
                  </p>
                </div>
                <Switch
                  checked={advancedForm.watch('enableAllManicurists')}
                  onCheckedChange={value =>
                    advancedForm.setValue('enableAllManicurists', value)
                  }
                />
              </div>

              {/* Allow New Clients */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Label className="text-base">Permitir Nuevos Clientes</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Permitir registrar nuevos clientes en esta sede
                  </p>
                </div>
                <Switch
                  checked={advancedForm.watch('allowNewClients')}
                  onCheckedChange={value =>
                    advancedForm.setValue('allowNewClients', value)
                  }
                />
              </div>

              {/* Allow Walk-ins */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Label className="text-base">
                    Permitir Clientes sin Cita
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Permitir atender clientes que lleguen sin cita previa
                  </p>
                </div>
                <Switch
                  checked={advancedForm.watch('allowWalkIns')}
                  onCheckedChange={value =>
                    advancedForm.setValue('allowWalkIns', value)
                  }
                />
              </div>

              {/* Use Spa DIAN Settings */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <Label className="text-base">
                    Usar Configuración DIAN del Spa
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Usar la configuración de facturación DIAN del spa principal
                  </p>
                </div>
                <Switch
                  checked={advancedForm.watch('useSpaDianSettings')}
                  onCheckedChange={value =>
                    advancedForm.setValue('useSpaDianSettings', value)
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="submit"
                disabled={isSubmittingAdvanced}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmittingAdvanced
                  ? 'Guardando...'
                  : 'Guardar Configuración'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
