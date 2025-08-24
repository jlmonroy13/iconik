'use client';

import { ReactNode } from 'react';
import { useAuthorization } from '@/hooks/useAuthorization';
import { Button } from '@/components/ui';
import { Shield, AlertTriangle } from 'lucide-react';

// =====================================================
// COMPONENTES DE PROTECCIÓN DE RUTAS POR ROLES
// =====================================================

interface GuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface SpaGuardProps extends GuardProps {
  spaId: string;
}

interface BranchGuardProps extends GuardProps {
  branchId: string;
}

interface FeatureGuardProps extends GuardProps {
  feature: string;
  spaId?: string;
  branchId?: string;
}

/**
 * Componente base para mostrar acceso denegado
 */
function AccessDenied({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="text-center">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button variant="primary" onClick={() => window.history.back()}>
          Volver
        </Button>
      </div>
    </div>
  );
}

/**
 * Guard para usuarios autenticados
 */
export function AuthenticatedGuard({ children, fallback }: GuardProps) {
  const { isAuthenticated } = useAuthorization();

  if (!isAuthenticated) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Requerido"
          message="Debes iniciar sesión para acceder a esta página."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para super administradores
 */
export function SuperAdminGuard({ children, fallback }: GuardProps) {
  const { isSuperAdmin } = useAuthorization();

  if (!isSuperAdmin) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Restringido"
          message="Solo los super administradores pueden acceder a esta funcionalidad."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para administradores de spa
 */
export function SpaAdminGuard({ children, fallback }: GuardProps) {
  const { isSpaAdmin } = useAuthorization();

  if (!isSpaAdmin) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Restringido"
          message="Solo los administradores de spa pueden acceder a esta funcionalidad."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para administradores de sede
 */
export function BranchAdminGuard({ children, fallback }: GuardProps) {
  const { isBranchAdmin } = useAuthorization();

  if (!isBranchAdmin) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Restringido"
          message="Solo los administradores de sede pueden acceder a esta funcionalidad."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para manicuristas
 */
export function ManicuristGuard({ children, fallback }: GuardProps) {
  const { isManicurist } = useAuthorization();

  if (!isManicurist) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Restringido"
          message="Solo las manicuristas pueden acceder a esta funcionalidad."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para acceso a spa específico
 */
export function SpaAccessGuard({ children, spaId, fallback }: SpaGuardProps) {
  const { canAccessSpa } = useAuthorization();

  if (!canAccessSpa(spaId)) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Denegado"
          message="No tienes permisos para acceder a este spa."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para gestión de spa específico
 */
export function SpaManagementGuard({
  children,
  spaId,
  fallback,
}: SpaGuardProps) {
  const { canManageSpa } = useAuthorization();

  if (!canManageSpa(spaId)) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Denegado"
          message="No tienes permisos para gestionar este spa."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para acceso a sede específica
 */
export function BranchAccessGuard({
  children,
  branchId,
  fallback,
}: BranchGuardProps) {
  const { canAccessBranch } = useAuthorization();

  if (!canAccessBranch(branchId)) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Denegado"
          message="No tienes permisos para acceder a esta sede."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para gestión de sede específica
 */
export function BranchManagementGuard({
  children,
  branchId,
  fallback,
}: BranchGuardProps) {
  const { canManageBranch } = useAuthorization();

  if (!canManageBranch(branchId)) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Denegado"
          message="No tienes permisos para gestionar esta sede."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para funcionalidades específicas
 */
export function FeatureGuard({
  children,
  feature,
  spaId,
  branchId,
  fallback,
}: FeatureGuardProps) {
  const { canAccessFeature } = useAuthorization();

  if (!canAccessFeature(feature, spaId, branchId)) {
    return (
      fallback || (
        <AccessDenied
          title="Funcionalidad No Disponible"
          message="No tienes permisos para acceder a esta funcionalidad."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para gestión de citas
 */
export function AppointmentManagementGuard({
  children,
  spaId,
  branchId,
  fallback,
}: {
  children: ReactNode;
  spaId: string;
  branchId?: string;
  fallback?: ReactNode;
}) {
  const { canManageAppointments } = useAuthorization();

  if (!canManageAppointments(spaId, branchId)) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Denegado"
          message="No tienes permisos para gestionar citas."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para visualización de reportes
 */
export function ReportsGuard({
  children,
  spaId,
  branchId,
  fallback,
}: {
  children: ReactNode;
  spaId: string;
  branchId?: string;
  fallback?: ReactNode;
}) {
  const { canViewReports } = useAuthorization();

  if (!canViewReports(spaId, branchId)) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Denegado"
          message="No tienes permisos para ver reportes."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para gestión de configuración DIAN
 */
export function DianSettingsGuard({
  children,
  spaId,
  fallback,
}: SpaGuardProps) {
  const { canManageDianSettings } = useAuthorization();

  if (!canManageDianSettings(spaId)) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Denegado"
          message="No tienes permisos para gestionar la configuración DIAN."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard para gestión de usuarios
 */
export function UserManagementGuard({
  children,
  targetSpaId,
  fallback,
}: {
  children: ReactNode;
  targetSpaId?: string;
  fallback?: ReactNode;
}) {
  const { canManageUsers } = useAuthorization();

  if (!canManageUsers(targetSpaId)) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Denegado"
          message="No tienes permisos para gestionar usuarios."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Guard combinado para roles específicos
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: {
  children: ReactNode;
  allowedRoles: (
    | 'SUPER_ADMIN'
    | 'SPA_ADMIN'
    | 'BRANCH_ADMIN'
    | 'MANICURIST'
    | 'CLIENT'
  )[];
  fallback?: ReactNode;
}) {
  const { user } = useAuthorization();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <AccessDenied
          title="Acceso Restringido"
          message="No tienes los permisos necesarios para acceder a esta funcionalidad."
        />
      )
    );
  }

  return <>{children}</>;
}

/**
 * Componente para mostrar advertencia de permisos
 */
export function PermissionWarning({
  message,
  showIcon = true,
}: {
  message: string;
  showIcon?: boolean;
}) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        {showIcon && (
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
        )}
        <p className="text-yellow-800 text-sm">{message}</p>
      </div>
    </div>
  );
}
