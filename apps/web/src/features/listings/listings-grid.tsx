import Link from 'next/link';
import { House } from 'lucide-react';
import { getTranslator } from '@rental-platform/i18n';
import type { Listing, ListingStatus } from '@/lib/listings/types';
import { formatAddress } from './format';

const t = getTranslator();

export function ListingsGrid({ listings }: { listings: Listing[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <li key={listing.id}>
          <Link
            href={`/dashboard/${listing.id}`}
            className="group block focus-visible:outline-none"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/5 transition-shadow group-focus-visible:ring-2 group-focus-visible:ring-foreground/40">
              <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                <House className="size-12" />
              </div>
              <StatusPill status={listing.status} />
            </div>
            <p className="mt-3 text-base font-medium text-foreground group-hover:underline underline-offset-4">
              {primaryLine(listing)}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {t('listings.card.subtitle', {
                type: t(`listings.detail.propertyType.${listing.classification.propertyType}` as const),
                municipality: listing.address.municipality,
              })}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function primaryLine(listing: Listing): string {
  const a = listing.address;
  const line = a.box
    ? `${a.street} ${a.number} bus ${a.box}`
    : `${a.street} ${a.number}`;
  return line || formatAddress(a);
}

function StatusPill({ status }: { status: ListingStatus }) {
  if (status === 'active') return null;
  const isAttention = status === 'draft';
  return (
    <span className="absolute top-3 left-3 inline-flex h-6 items-center gap-1.5 rounded-full bg-background pr-2.5 pl-2 text-xs font-medium text-foreground ring-1 ring-foreground/10">
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${isAttention ? 'bg-destructive' : 'bg-foreground/60'}`}
      />
      {t(`listings.card.status.${status}` as const)}
    </span>
  );
}
