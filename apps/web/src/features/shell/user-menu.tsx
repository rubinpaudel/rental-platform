'use client';

import { useRouter } from 'next/navigation';
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '@rental-platform/ui';
import { authClient } from '@/lib/auth/auth-client';

export function UserMenu({ name, email }: { name: string; email: string }) {
  const router = useRouter();

  async function onSignOut() {
    await authClient.signOut();
    router.replace('/sign-in');
  }

  return (
    <Dropdown
      trigger={
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-sm font-medium text-paper transition-colors hover:bg-accent-hover">
          {name.charAt(0).toUpperCase()}
        </span>
      }
    >
      <DropdownLabel>{name}</DropdownLabel>
      <div className="px-3 pb-2 text-xs text-ink-faint">{email}</div>
      <DropdownSeparator />
      <DropdownItem onClick={onSignOut}>Afmelden</DropdownItem>
    </Dropdown>
  );
}
