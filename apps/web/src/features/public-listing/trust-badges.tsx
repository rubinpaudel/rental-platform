import { getTranslator } from '@rental-platform/i18n';
import { KeyIcon, SofaIcon, PawIcon } from './icons';
import type { PublicListing } from './mock-listing';

const t = getTranslator();

export function TrustBadges({ listing }: { listing: PublicListing }) {
  const rows = [
    {
      icon: KeyIcon,
      title: t('publicListing.badge.availableFrom', { date: listing.availableFrom }),
      body: t('publicListing.badge.availableFrom.body'),
    },
    listing.furnished
      ? {
          icon: SofaIcon,
          title: t('publicListing.badge.furnished'),
          body: t('publicListing.badge.furnished.body'),
        }
      : null,
    listing.petsAllowed
      ? {
          icon: PawIcon,
          title: t('publicListing.badge.pets'),
          body: t('publicListing.badge.pets.body'),
        }
      : null,
  ].filter((r): r is Exclude<typeof r, null> => r !== null);

  return (
    <section className="flex flex-col gap-5">
      {rows.map((row) => {
        const I = row.icon;
        return (
          <div key={row.title} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-6 shrink-0 items-center justify-center text-foreground"
            >
              <I width={22} height={22} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{row.title}</p>
              <p className="mt-0.5 text-sm text-foreground/70">{row.body}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
