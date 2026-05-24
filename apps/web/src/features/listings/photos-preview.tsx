import Link from 'next/link';
import { ImageIcon } from 'lucide-react';
import { buttonVariants } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import type { ListingPhoto } from '@/lib/listings/types';
import { photoUrl } from '@/lib/listings/photo-url';

const t = getTranslator();

const MAX_THUMBS = 6;

export function PhotosPreview({
  listingId,
  photos,
}: {
  listingId: string;
  photos: ListingPhoto[];
}) {
  const sorted = [...photos].sort((a, b) => a.order - b.order).slice(0, MAX_THUMBS);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-medium text-foreground">{t('listings.photos.title')}</h2>
        <Link
          href={`/dashboard/listings/${listingId}/photos`}
          className={buttonVariants({ size: 'sm', variant: 'outline' })}
        >
          {t('listings.detail.editPhotos')}
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          <ImageIcon className="size-5" />
          <p className="mt-2">{t('listings.photos.empty.description')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {sorted.map((photo) => {
            const url = photoUrl(photo.storageKey);
            return (
              <div
                key={photo.storageKey}
                className="relative aspect-square overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/5"
              >
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={url}
                    alt={photo.alt ?? ''}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-5" />
                  </div>
                )}
                {photo.order === 0 && (
                  <span className="absolute left-1 top-1 rounded-md bg-foreground/85 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-background">
                    {t('listings.photos.cover')}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
