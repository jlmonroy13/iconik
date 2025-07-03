# Services

Esta carpeta contiene los servicios de la aplicación que manejan la lógica de negocio y las operaciones de datos.

## Estructura

```
src/services/
├── dashboard/          # Servicios relacionados con el dashboard
│   ├── dashboardService.ts
│   └── index.ts
└── README.md
```

## Dashboard Services

### getDashboardStats()

Servicio principal que obtiene todas las estadísticas necesarias para el dashboard.

**Ubicación:** `src/services/dashboard/dashboardService.ts`

**Funcionalidad:**
- Obtiene estadísticas del día, semana, mes y totales
- Calcula métricas de rendimiento
- Obtiene datos de citas, pagos, clientes
- Maneja información de caja registradora
- Proporciona datos de top performers y servicios populares

**Uso:**
```typescript
import { getDashboardStats } from '@/services/dashboard'

const stats = await getDashboardStats()
```

## Convenciones

- Cada servicio debe estar en su propia carpeta
- Usar archivos `index.ts` para exportaciones limpias
- Mantener la lógica de negocio separada de los componentes
- Documentar las funciones principales
- Usar tipos TypeScript apropiados

## Agregar Nuevos Servicios

1. Crear una nueva carpeta para el servicio
2. Implementar la lógica del servicio
3. Crear un archivo `index.ts` para exportaciones
4. Documentar el servicio
5. Actualizar este README si es necesario
