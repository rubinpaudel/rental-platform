'use client';

import { useActiveOrganization, useSession } from '@/lib/auth/auth-client';
import { orgKindOf } from '@/lib/org-kind';
import { OrgKindBadge } from '@/features/dashboard/org-kind-badge';
import { OrgSwitcher } from '@/features/org/org-switcher';
import { InviteMemberDialog } from '@/features/org/invite-member-dialog';
import { UserMenu } from './user-menu';
import { Wordmark } from './wordmark';

export function TopBar() {
  const { data: session } = useSession();
  const { data: activeOrg } = useActiveOrganization();
  const kind = orgKindOf(activeOrg);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-5">
          <Wordmark className="text-[1.15rem]" />
          <span className="h-5 w-px bg-line-strong" />
          <div className="flex items-center gap-2.5">
            <span className="font-display text-[1.05rem] font-medium tracking-[-0.01em] text-ink">
              {activeOrg?.name ?? '—'}
            </span>
            {activeOrg && <OrgKindBadge kind={kind} />}
          </div>
          <OrgSwitcher />
        </div>
        <div className="flex items-center gap-3">
          {activeOrg && <InviteMemberDialog kind={kind} />}
          {session?.user && (
            <UserMenu name={session.user.name} email={session.user.email} />
          )}
        </div>
      </div>
    </header>
  );
}
