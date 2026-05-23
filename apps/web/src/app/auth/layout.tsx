import type { ReactNode } from 'react';
import Link from 'next/link';
import { Wordmark } from '@/features/shell/wordmark';

/**
 * Minimal placeholder shell: wordmark top-left, form centered both axes.
 * Anything richer (brand panel, editorial copy) waits for the brand
 * handoff. Keep this file boring on purpose.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-6 py-6 sm:px-10 sm:py-8">
        <Link href="/auth/sign-in" className="inline-block">
          <Wordmark />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
