'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  spaId: string;
  branchId: string;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard/branch-admin/[spaId]/[branchId]',
    icon: '📊',
    description: 'Vista general de la sede',
  },
  {
    name: 'Clientes',
    href: '/dashboard/branch-admin/[spaId]/[branchId]/clients',
    icon: '👥',
    description: 'Gestión de clientes',
  },
  {
    name: 'Citas',
    href: '/dashboard/branch-admin/[spaId]/[branchId]/appointments',
    icon: '📅',
    description: 'Programación y gestión de citas',
  },
  {
    name: 'Manicuristas',
    href: '/dashboard/branch-admin/[spaId]/[branchId]/manicurists',
    icon: '💅',
    description: 'Gestión de manicuristas',
  },
  {
    name: 'Servicios',
    href: '/dashboard/branch-admin/[spaId]/[branchId]/services',
    icon: '🛠️',
    description: 'Servicios disponibles',
  },
  {
    name: 'Pagos',
    href: '/dashboard/branch-admin/[spaId]/[branchId]/payments',
    icon: '💰',
    description: 'Gestión de pagos',
  },
  {
    name: 'Configuración',
    href: '/dashboard/branch-admin/[spaId]/[branchId]/settings',
    icon: '⚙️',
    description: 'Configuración de la sede',
  },
];

export function Sidebar({ isOpen, onClose, spaId, branchId }: SidebarProps) {
  const pathname = usePathname();

  const getCurrentPath = (href: string) => {
    return href.replace('[spaId]', spaId).replace('[branchId]', branchId);
  };

  const isActive = (href: string) => {
    const currentPath = getCurrentPath(href);
    return pathname === currentPath;
  };

  const sidebarContent = (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gray-800 shadow-xl">
      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map(item => (
                <li key={item.name}>
                  <Link
                    href={getCurrentPath(item.href)}
                    className={cn(
                      isActive(item.href)
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors'
                    )}
                    onClick={onClose}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                {sidebarContent}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:block h-full">{sidebarContent}</div>
    </>
  );
}
