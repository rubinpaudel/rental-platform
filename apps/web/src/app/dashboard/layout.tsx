import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server-session';
import { AppShell } from '@/features/shell/app-shell';

// Authoritative, server-side gate. Middleware already did the fast cookie
// check; this resolves the real session so a stale/expired cookie can't
// render the dashboard, and there is no client-side redirect flash.
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect('/sign-in');

  return <AppShell>{children}</AppShell>;
}
