import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server-session';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect('/auth/sign-in');
  return <>{children}</>;
}
