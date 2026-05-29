import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server-session';
import { getActiveOrg } from '@/lib/auth/server-active-org';
import { DashboardShell } from '@/features/shell/dashboard-shell';

// Authoritative, server-side gate. Middleware already did the fast cookie
// check; this resolves the real session so a stale/expired cookie can't
// render the dashboard, and there is no client-side redirect flash.
// We also resolve the active org's kind here so the sidebar nav renders
// the kind-aware variant without a client roundtrip.
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Session + active-org are independent fetches; parallelizing them shaves
  // one round-trip off every dashboard render.
  const [session, activeOrg] = await Promise.all([getServerSession(), getActiveOrg()]);
  if (!session) redirect('/auth/sign-in');

  const kind = activeOrg?.kind ?? 'private';

  return (
    <DashboardShell kind={kind} name={session.user.name} email={session.user.email}>
      {children}
    </DashboardShell>
  );
}
