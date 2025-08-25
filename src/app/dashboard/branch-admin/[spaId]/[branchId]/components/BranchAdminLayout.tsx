'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { BranchAdminHeader } from './BranchAdminHeader';
import { AuthenticatedUser } from '@/types/auth';

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

interface BranchAdminLayoutProps {
  user: AuthenticatedUser;
  branch: BranchWithSpaAndStats;
  spaId: string;
  branchId: string;
  children: React.ReactNode;
}

export function BranchAdminLayout({
  user,
  branch,
  spaId,
  branchId,
  children,
}: BranchAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - Full width and on top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <BranchAdminHeader
          user={user}
          branch={branch}
          onMenuClick={() => setSidebarOpen(true)}
        />
      </div>

      {/* Sidebar - Below header with proper spacing */}
      <div className="fixed top-16 left-0 bottom-0 z-40">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          spaId={spaId}
          branchId={branchId}
        />
      </div>

      {/* Main content area */}
      <div className="pt-16 lg:pl-64">
        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
