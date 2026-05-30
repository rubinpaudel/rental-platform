import Image from 'next/image';
import { getTranslator } from '@rental-platform/i18n';
import { GridIcon } from './icons';
import type { PublicListing } from './mock-listing';

const t = getTranslator();

/**
 * The 5-tile Airbnb mosaic: one tall hero left, four square tiles in a 2x2
 * grid on the right. Falls back gracefully to a single image on small
 * screens. Wrapped in `rounded-xl` with `overflow-hidden` so the inner
 * 2px gutter doesn't leak into the corner radius.
 */
export function PhotoGallery({ photos }: { photos: PublicListing['photos'] }) {
  const hero = photos[0];
  const tiles = photos.slice(1, 5);
  if (!hero) return null;
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="grid grid-cols-1 gap-[2px] sm:grid-cols-4 sm:grid-rows-2">
        <Tile
          src={hero.src}
          alt={hero.alt}
          priority
          className="aspect-[4/3] sm:col-span-2 sm:row-span-2 sm:aspect-auto"
        />
        {tiles.map((p) => (
          <Tile
            key={p.src}
            src={p.src}
            alt={p.alt}
            className="hidden aspect-square sm:block"
          />
        ))}
      </div>
      <button
        type="button"
        className="absolute right-4 bottom-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-background px-3 text-xs font-medium text-foreground ring-1 ring-foreground/15 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <GridIcon />
        {t('publicListing.showAllPhotos')}
      </button>
    </div>
  );
}

function Tile({
  src,
  alt,
  className = '',
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 640px) 33vw, 100vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
