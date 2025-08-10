# Spa Utils - Funciones Utilitarias para Gestión de SpaId

Este módulo proporciona funciones utilitarias para manejar el `spaId` en el contexto de usuarios super admin y usuarios regulares.

## Funciones Disponibles

### `getCurrentSpaId(): Promise<string>`

Obtiene el `spaId` apropiado para el usuario actual:

- **Si el usuario tiene un `spaId` asociado**: Retorna ese `spaId`
- **Si el usuario es super admin y no tiene `spaId`**: Retorna el primer spa activo disponible en la base de datos
- **Si el usuario no es super admin y no tiene `spaId`**: Lanza un error (para redirigir a onboarding)

#### Uso:
```typescript
import { getCurrentSpaId } from '@/lib/utils/spa-utils'

export async function someAction() {
  try {
    const spaId = await getCurrentSpaId()
    // Usar spaId para consultas de base de datos
    const data = await prisma.someModel.findMany({ where: { spaId } })
    return { success: true, data }
  } catch (error) {
    // Manejar error (redirigir a onboarding, mostrar mensaje de error, etc.)
    return { success: false, message: 'Error occurred' }
  }
}
```

### `getSpaIdWithFallback(): Promise<string | null>`

Similar a `getCurrentSpaId` pero retorna `null` en lugar de lanzar un error cuando el usuario no tiene `spaId` y no es super admin.

#### Uso:
```typescript
import { getSpaIdWithFallback } from '@/lib/utils/spa-utils'

export async function someOtherAction() {
  const spaId = await getSpaIdWithFallback()
  if (!spaId) {
    // Manejar redirección a onboarding manualmente
    redirect('/onboarding')
  }
  // Usar spaId para consultas de base de datos
}
```

## Archivos Actualizados

Los siguientes archivos han sido actualizados para usar estas funciones utilitarias:

- `src/services/dashboard/dashboardService.ts`
- `src/app/dashboard/appointments/actions.ts`
- `src/app/dashboard/clients/actions.ts`
- `src/app/dashboard/manicurists/actions.ts`
- `src/app/dashboard/spa-services/actions.ts`
- `src/app/dashboard/payment-methods/actions.ts`
- `src/app/dashboard/settings/actions.ts`

## Beneficios

1. **Consistencia**: Todas las páginas del dashboard ahora manejan el `spaId` de manera consistente
2. **Soporte para Super Admin**: Los usuarios super admin pueden acceder a cualquier spa sin tener uno específico asignado
3. **Mantenibilidad**: La lógica de obtención del `spaId` está centralizada en un solo lugar
4. **Flexibilidad**: Dos funciones diferentes para diferentes casos de uso

## Consideraciones

- Las funciones asumen que existe al menos un spa activo en la base de datos para usuarios super admin
- Si no hay spas activos, `getCurrentSpaId` lanzará un error
- Las funciones son asíncronas y deben ser llamadas con `await`
