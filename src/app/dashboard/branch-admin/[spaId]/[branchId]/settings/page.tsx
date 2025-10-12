import { notFound } from 'next/navigation';
import { requireBranchAccessForPage } from '@/lib/auth-utils';
import { getBranchSettings } from './queries';
import { SettingsClient } from './components/SettingsClient';

interface SettingsPageProps {
  params: Promise<{
    spaId: string;
    branchId: string;
  }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { spaId, branchId } = await params;

  // Require BRANCH_ADMIN role and branch access
  await requireBranchAccessForPage(spaId, branchId);

  // Get branch with settings
  const branch = await getBranchSettings(branchId);

  if (!branch) {
    notFound();
  }

  return <SettingsClient branch={branch} spaId={spaId} branchId={branchId} />;
}
