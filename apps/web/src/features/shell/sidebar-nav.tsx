'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Inbox, KeyRound, Settings, Users, UserSquare } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import type { TranslationKey } from '@rental-platform/i18n';
import type { OrgKind } from '@/lib/org-kind';

const t = getTranslator();

interface NavItem {
  href: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
  enabled: boolean;
}

// "enabled: false" entries render greyed-out — kept in the nav so the
// landlord can see what's coming next, but pre-MLP they don't navigate.
function itemsFor(kind: OrgKind): NavItem[] {
  const lastItem: NavItem =
    kind === 'agency'
      ? { href: '/dashboard/team', labelKey: 'shell.nav.team', icon: Users, enabled: false }
      : {
          href: '/dashboard/co-owner',
          labelKey: 'shell.nav.coOwner',
          icon: UserSquare,
          enabled: false,
        };

  return [
    {
      href: '/dashboard/listings',
      labelKey: kind === 'private' ? 'shell.nav.listings.private' : 'shell.nav.listings',
      icon: KeyRound,
      enabled: true,
    },
    { href: '/dashboard/inbox', labelKey: 'shell.nav.inbox', icon: Inbox, enabled: false },
    { href: '/dashboard/calendar', labelKey: 'shell.nav.calendar', icon: Calendar, enabled: false },
    {
      href: '/dashboard/settings',
      labelKey: 'shell.nav.settings',
      icon: Settings,
      enabled: false,
    },
    lastItem,
  ];
}

export function SidebarNav({ kind }: { kind: OrgKind }) {
  const pathname = usePathname();
  const items = itemsFor(kind);

  return (
    <nav aria-label="Primary" className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const active =
          item.enabled &&
          (pathname === item.href || pathname.startsWith(`${item.href}/`));
        const Icon = item.icon;
        const className = cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          item.enabled
            ? active
              ? 'bg-foreground/[0.07] text-foreground'
              : 'text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground'
            : 'cursor-not-allowed text-muted-foreground/50',
        );

        if (!item.enabled) {
          return (
            <span key={item.href} aria-disabled className={className}>
              <Icon className="size-4" />
              {t(item.labelKey)}
            </span>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={className}
          >
            <Icon className="size-4" />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
