import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server-session';
import { TopBar } from '@/features/shell/top-bar';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect('/auth/sign-in');

  return (
    <div className="min-h-screen bg-background">
      <TopBar name={session.user.name} email={session.user.email} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
