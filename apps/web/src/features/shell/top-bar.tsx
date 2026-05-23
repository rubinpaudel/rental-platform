'use client';

import { useSession } from '@/lib/auth/auth-client';
import { OrgSwitcher } from '@/features/org/org-switcher';
import { UserMenu } from './user-menu';
import { Wordmark } from './wordmark';

export function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-5">
          <Wordmark className="text-[1.15rem]" />
          <OrgSwitcher />
        </div>
        <div className="flex items-center gap-3">
          {session?.user && (
            <UserMenu name={session.user.name} email={session.user.email} />
          )}
        </div>
      </div>
    </header>
  );
}
