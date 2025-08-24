'use client';

import { signOut } from 'next-auth/react';
import { UserMenu } from './UserMenu';
import { AuthenticatedUser } from '@/types/auth';
import { LogOut, User, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  user: AuthenticatedUser;
  title?: string;
  subtitle?: string;
  showUserInfo?: boolean;
  className?: string;
}

export function DashboardHeader({
  user,
  title,
  subtitle,
  showUserInfo = true,
  className = '',
}: DashboardHeaderProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const getUserDisplayName = () => {
    if (user.name && user.name.trim()) {
      return user.name.trim();
    }
    return user.email.split('@')[0];
  };

  const getUserRoleDisplay = () => {
    switch (user.role) {
      case 'SUPER_ADMIN':
        return 'Super Administrador';
      case 'SPA_ADMIN':
        return 'Administrador de Spa';
      case 'BRANCH_ADMIN':
        return 'Administrador de Sede';
      case 'MANICURIST':
        return 'Manicurista';
      case 'CLIENT':
        return 'Cliente';
      default:
        return user.role;
    }
  };

  const menuItems = [
    {
      label: 'Mi Perfil',
      icon: <User className="h-4 w-4" />,
      href: '#', // TODO: Add profile page
    },
    {
      label: 'Configuración',
      icon: <Settings className="h-4 w-4" />,
      href: '#', // TODO: Add settings page
    },
    {
      divider: true,
    },
    {
      label: 'Cerrar Sesión',
      icon: <LogOut className="h-4 w-4" />,
      onClick: handleLogout,
    },
  ];

  return (
    <header
      className={`flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Left side - Title and subtitle */}
      <div className="flex-1">
        {title && (
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side - User info and menu */}
      {showUserInfo && (
        <div className="flex items-center space-x-2">
          {/* User info */}
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {getUserDisplayName()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getUserRoleDisplay()}
            </div>
          </div>

          {/* User menu */}
          <UserMenu
            items={menuItems}
            fallback={getUserDisplayName().charAt(0).toUpperCase()}
            alt={`Menú de ${getUserDisplayName()}`}
          />
        </div>
      )}
    </header>
  );
}
