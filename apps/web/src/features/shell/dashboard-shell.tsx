import type { ReactNode } from 'react';
import { TopBar } from './top-bar';
import { SidebarNav } from './sidebar-nav';
import type { OrgKind } from '@/lib/org-kind';

/**
 * Server-rendered dashboard shell. Sidebar nav is a client child because it
 * needs `usePathname` for the active-link highlight; everything around it
 * (frame, top bar mount) is server-only.
 */
export function DashboardShell({
  kind,
  name,
  email,
  children,
}: {
  kind: OrgKind;
  name: string;
  email: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar name={name} email={email} />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 md:grid-cols-[224px_1fr]">
        <aside className="hidden border-r border-border md:block">
          <SidebarNav kind={kind} />
        </aside>
        <main className="min-w-0 px-6 py-10 md:px-10">
          <div className="reveal">{children}</div>
        </main>
      </div>
    </div>
  );
}
