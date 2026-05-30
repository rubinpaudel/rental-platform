import { getTranslator } from '@rental-platform/i18n';
import { Badge } from '@rental-platform/ui';
import type { PublicListing } from './mock-listing';

const t = getTranslator();

export function HostSummary({ listing }: { listing: PublicListing }) {
  const baths =
    listing.baths === 1
      ? t('publicListing.statsBath', { baths: listing.baths })
      : t('publicListing.statsBaths', { baths: listing.baths });
  return (
    <section className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-medium text-foreground">
          {t('publicListing.hostedBy', { name: listing.host.name })}
        </h2>
        <p className="mt-1 text-sm text-foreground tabular-nums">
          {t('publicListing.statsRooms', { rooms: listing.rooms })}
          <span aria-hidden="true" className="mx-2 text-foreground/50">·</span>
          {t('publicListing.statsSurface', { surface: listing.surfaceM2 })}
          <span aria-hidden="true" className="mx-2 text-foreground/50">·</span>
          {baths}
        </p>
        <div className="mt-2">
          <Badge variant="outline">
            {listing.host.kind === 'agency' ? 'Agency' : 'Private'}
          </Badge>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-base font-medium text-foreground ring-1 ring-border"
      >
        {listing.host.name.charAt(0)}
      </span>
    </section>
  );
}
