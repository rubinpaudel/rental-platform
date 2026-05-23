'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@rental-platform/ui';
import { authClient, useActiveOrganization, useListOrganizations } from '@/lib/auth/auth-client';

/**
 * Lets a user who owns one org AND is a member of another switch the active
 * org. Hidden when there is nothing to switch between.
 */
export function OrgSwitcher() {
  const { data: organizations } = useListOrganizations();
  const { data: activeOrg } = useActiveOrganization();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  if (!organizations || organizations.length < 2) return null;

  async function switchTo(organizationId: string) {
    if (organizationId === activeOrg?.id) return;
    setPending(true);
    await authClient.organization.setActive({ organizationId });
    setPending(false);
    router.refresh();
  }

  return (
    <Dropdown
      align="start"
      trigger={
        <span className="rounded-md px-2 py-1 text-sm font-medium text-ink-soft hover:bg-ink/[0.05]">
          Wissel organisatie
        </span>
      }
    >
      <DropdownLabel>Organisaties</DropdownLabel>
      <DropdownSeparator />
      {organizations.map((org) => (
        <DropdownItem
          key={org.id}
          disabled={pending}
          onClick={() => switchTo(org.id)}
          className={org.id === activeOrg?.id ? 'font-semibold text-ink' : undefined}
        >
          {org.name}
          {org.id === activeOrg?.id ? ' ·' : ''}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
