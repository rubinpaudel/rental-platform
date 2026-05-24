import type { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { buttonVariants } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import { getServerSession } from '@/lib/auth/server-session';
import { Wordmark } from '@/features/shell/wordmark';

const t = getTranslator();

export default async function FlowLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect('/auth/sign-in');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/dashboard" aria-label="plekje">
          <Wordmark />
        </Link>
        <Link
          href="/dashboard"
          className={buttonVariants({ variant: 'outline', size: 'sm', className: 'rounded-full' })}
        >
          {t('listings.flow.saveExit')}
        </Link>
      </header>
      {children}
    </div>
  );
}
