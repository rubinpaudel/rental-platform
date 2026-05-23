'use client';

import type { ReactNode } from 'react';
import { TopBar } from './top-bar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="reveal">{children}</div>
      </main>
    </div>
  );
}
