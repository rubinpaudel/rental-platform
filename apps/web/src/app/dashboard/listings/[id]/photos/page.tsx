import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import { getListingOrNull } from '@/lib/listings/queries';
import { PhotosManager } from '@/features/listings/photos-manager/photos-manager';
import { listingDisplayTitle } from '@/features/listings/format';

const t = getTranslator();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingPhotosPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingOrNull(id);
  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href={`/dashboard/listings/${listing.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {listingDisplayTitle(listing)}
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3 pb-8">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            {t('listings.photos.title')}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('listings.photos.subtitle')}</p>
        </div>
        <Link
          href={`/dashboard/listings/${listing.id}`}
          className={buttonVariants({ size: 'sm', variant: 'outline' })}
        >
          {t('listings.photos.done')}
        </Link>
      </div>

      <PhotosManager listingId={listing.id} initialPhotos={listing.photos} />
    </div>
  );
}
