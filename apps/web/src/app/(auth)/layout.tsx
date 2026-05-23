import type { ReactNode } from 'react';
import Link from 'next/link';
import { Wordmark } from '@/features/shell/wordmark';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel — editorial, architectural */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-accent px-14 py-12 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(242,238,227,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(242,238,227,0.4) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -bottom-28 select-none font-display text-[26rem] leading-none text-paper/[0.05]"
        >
          €
        </div>

        <Link href="/sign-in" className="reveal relative w-fit">
          <Wordmark tone="paper" />
        </Link>

        <div className="reveal relative max-w-md" style={{ animationDelay: '120ms' }}>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-paper/55">
            Verhuurbeheer
          </p>
          <h1 className="mt-5 font-display text-[2.9rem] leading-[1.08] font-medium tracking-[-0.02em] text-paper">
            Eén plek voor je{' '}
            <span className="italic text-[#d8c79c]">volledige</span> verhuur.
          </h1>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-paper/65">
            Of je nu een makelaarskantoor runt of je eigen pand verhuurt — beheer
            panden, kandidaten en je team vanuit één rustige werkomgeving.
          </p>
        </div>

        <div
          className="reveal relative flex items-center gap-6 text-[0.75rem] tracking-wide text-paper/45"
          style={{ animationDelay: '220ms' }}
        >
          <span>Makelaars</span>
          <span className="h-px w-8 bg-paper/25" />
          <span>Private eigenaars</span>
        </div>
      </aside>

      {/* Form side */}
      <main className="relative flex flex-col">
        <div className="flex items-center justify-between px-6 py-6 lg:hidden">
          <Wordmark />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16 lg:px-14">
          <div className="reveal w-full max-w-md" style={{ animationDelay: '80ms' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
