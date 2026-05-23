'use client';

import { getTranslator } from '@rental-platform/i18n';
import { useActiveOrganization, useSession } from '@/lib/auth/auth-client';
import { copyFor, orgKindOf } from '@/lib/org-kind';
import { OrgKindBadge } from './org-kind-badge';

const t = getTranslator();

export function DashboardGreeting() {
  const { data: session } = useSession();
  const { data: activeOrg } = useActiveOrganization();

  const kind = orgKindOf(activeOrg);
  const orgName = activeOrg?.name ?? '';
  const userName = session?.user?.name ?? '';

  return (
    <div className="space-y-4">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
        {t('dashboard.eyebrow')}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="font-display text-[2.6rem] leading-[1.05] font-medium tracking-[-0.02em] text-ink">
          {copyFor(kind).greeting(orgName)}
        </h1>
        {activeOrg && <OrgKindBadge kind={kind} />}
      </div>
      <p className="text-[0.95rem] text-ink-soft">
        {orgName
          ? t('dashboard.welcomeBackWithOrg', { userName, orgName })
          : t('dashboard.welcomeBack', { userName })}
      </p>
    </div>
  );
}
