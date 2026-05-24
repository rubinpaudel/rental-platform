import { notFound } from 'next/navigation';
import { Separator } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import { getListingOrNull } from '@/lib/listings/queries';
import { ListingDetailHeader } from '@/features/listings/listing-detail-header';
import { PhotosPreview } from '@/features/listings/photos-preview';
import { ListingForm } from '@/features/listings/listing-form/listing-form';
import { fromListing } from '@/features/listings/listing-form/schema';

const t = getTranslator();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingOrNull(id);
  if (!listing) notFound();

  const initialValues = fromListing(listing);

  return (
    <div className="mx-auto max-w-3xl">
      <ListingDetailHeader listing={listing} />

      <PhotosPreview listingId={listing.id} photos={listing.photos} />

      <Separator className="my-10" />

      <section className="space-y-4">
        <h2 className="text-base font-medium text-foreground">
          {t('listings.detail.section.basics')}
        </h2>
        <ListingForm mode="edit" listingId={listing.id} initialValues={initialValues} />
      </section>
    </div>
  );
}
