import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTranslator } from '@rental-platform/i18n';
import type { Listing } from '@/lib/listings/types';
import { formatAddress, listingDisplayTitle } from './format';
import { StatusToggle } from './status-toggle';

const t = getTranslator();

export function ListingDetailHeader({ listing }: { listing: Listing }) {
  return (
    <div className="pb-8">
      <Link
        href="/dashboard/listings"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t('listings.title')}
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            {listingDisplayTitle(listing)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{formatAddress(listing.address)}</p>
        </div>
        <StatusToggle listingId={listing.id} status={listing.status} />
      </div>
    </div>
  );
}
