# Scripts de Utilidad

Este directorio contiene scripts de utilidad para el proyecto Iconik.

## Scripts Disponibles

### `check-spas.js`

Script para verificar el estado de spas y usuarios en la base de datos.

#### Uso:
```bash
node scripts/check-spas.js
```

#### Funcionalidad:
- Muestra todos los spas en la base de datos con sus estadísticas
- Lista todos los usuarios con sus roles y tipos
- Proporciona un resumen de la distribución de usuarios
- Identifica super admins con y sin spa asociado

#### Salida de ejemplo:
```
🔍 Checking spas in database...
✅ Found 2 spas:

1. Spa: Spa de Ejemplo
   ID: cme5t9liy0001cdxr29rh16jq
   Slug: spa-ejemplo
   Email: info@spaejemplo.com
   Phone: +1234567890
   Active: true
   Created: Sun Aug 10 2025 10:00:50 GMT-0500
   Counts:
     - Users: 1
     - Clients: 0
     - Appointments: 0
     - Services: 0

👥 Found 3 users:

1. User: Administrador del Spa
   Email: spa@iconik.com
   Role: ADMIN
   Type: Regular User
   Super Admin: false
   Spa ID: cme5t9liy0001cdxr29rh16jq

2. User: Super Administrador
   Email: jlmonroy13@gmail.com
   Role: SUPER_ADMIN
   Type: Super Admin (no spa)
   Super Admin: true
   Spa ID: N/A

📊 Summary:
   - Total users: 3
   - Super admins: 1
   - Regular users: 2
   - Users with spa: 2
   - Users without spa: 1
```

#### Casos de uso:
- **Debugging**: Verificar el estado de la base de datos
- **Verificación**: Confirmar que los usuarios están correctamente configurados
- **Auditoría**: Revisar la distribución de usuarios y spas
- **Testing**: Verificar que la funcionalidad de super admin funciona correctamente

## Scripts Eliminados

### `test-prisma.js` ❌
- **Razón**: Ya no necesario después de la configuración inicial
- **Propósito**: Testing de conexión de Prisma y modelos
- **Estado**: Eliminado

### `test-api.js` ❌
- **Razón**: Crea datos de prueba que pueden contaminar la base de datos
- **Propósito**: Testing de endpoints de API
- **Estado**: Eliminado

## Notas

- Los scripts están diseñados para ser ejecutados desde la raíz del proyecto
- Requieren que la base de datos esté configurada y accesible
- El script `check-spas.js` es seguro de ejecutar en producción
