import { getTranslator } from '@rental-platform/i18n';
import { ShareIcon, HeartIcon } from './icons';
import type { PublicListing } from './mock-listing';

const t = getTranslator();

export function TitleBlock({ listing }: { listing: PublicListing }) {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl leading-tight font-semibold text-foreground sm:text-[1.6rem]">
          {listing.title}
        </h1>
        <p className="mt-1 text-sm text-foreground">
          <span className="underline underline-offset-2">
            {listing.municipality}, {listing.region}
          </span>
          <span aria-hidden="true" className="mx-2 text-foreground/50">
            ·
          </span>
          <span className="tabular-nums">{listing.surfaceM2} m²</span>
          <span aria-hidden="true" className="mx-2 text-foreground/50">
            ·
          </span>
          <span>EPC {listing.epcLabel}</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ShareIcon size={14} />
          <span className="underline underline-offset-2">{t('publicListing.share')}</span>
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <HeartIcon size={14} />
          <span className="underline underline-offset-2">{t('publicListing.save')}</span>
        </button>
      </div>
    </header>
  );
}
