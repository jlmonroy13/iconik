'use client';

import { useState } from 'react';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { signOut } from 'next-auth/react';
import { AuthenticatedUser } from '@/types/auth';
import Image from 'next/image';

type BranchWithSpaAndStats = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  address: string;
  phone: string | null;
  email: string | null;
  openingTime: string | null;
  closingTime: string | null;
  isActive: boolean;
  isMain: boolean;
  invoicePrefix: string | null;
  spaId: string;
  createdAt: Date;
  updatedAt: Date;
  spa: {
    name: string;
    logoUrl: string | null;
  };
  _count: {
    clients: number;
    manicurists: number;
    services: number;
    appointments: number;
  };
};

interface BranchAdminHeaderProps {
  user: AuthenticatedUser;
  branch: BranchWithSpaAndStats;
  onMenuClick: () => void;
}

export function BranchAdminHeader({
  user,
  branch,
  onMenuClick,
}: BranchAdminHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 w-full">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Abrir menú lateral</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" />

      {/* Branch info - Simplified */}
      <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
        <div className="flex items-center gap-x-3">
          {branch.spa.logoUrl ? (
            <Image
              className="h-8 w-8 rounded-full"
              src={branch.spa.logoUrl}
              alt={branch.spa.name}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {branch.spa.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {branch.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {branch.spa.name}
            </p>
          </div>
        </div>
      </div>

      {/* User menu - With dropdown */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <Avatar
              fallback={user.name?.charAt(0) || user.email.charAt(0)}
              alt={user.name || 'Usuario'}
              size="sm"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name || 'Sin nombre'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </Button>

          {/* Dropdown menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleSignOut}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
}
