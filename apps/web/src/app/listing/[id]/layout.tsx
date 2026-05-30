import type { ReactNode } from 'react';
import Link from 'next/link';
import { Wordmark } from '@/features/shell/wordmark';

export default function PublicListingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" aria-label="plekje">
            <Wordmark />
          </Link>
          <Link
            href="/auth/sign-in"
            className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-foreground/70"
          >
            Inloggen
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
