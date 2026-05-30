import { Separator } from '@rental-platform/ui';
import { mockListing } from '@/features/public-listing/mock-listing';
import { PhotoGallery } from '@/features/public-listing/photo-gallery';
import { TitleBlock } from '@/features/public-listing/title-block';
import { HostSummary } from '@/features/public-listing/host-summary';
import { TrustBadges } from '@/features/public-listing/trust-badges';
import { Description } from '@/features/public-listing/description';
import { Sleeping } from '@/features/public-listing/sleeping';
import { Amenities } from '@/features/public-listing/amenities';
import { HostCard } from '@/features/public-listing/host-card';
import { ApplyWidget } from '@/features/public-listing/apply-widget';

export default function PublicListingPage() {
  const listing = mockListing;
  return (
    <main className="mx-auto max-w-6xl px-6 pt-6 pb-20">
      <TitleBlock listing={listing} />

      <div className="mt-5">
        <PhotoGallery photos={listing.photos} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col">
          <HostSummary listing={listing} />
          <Separator className="my-8" />
          <TrustBadges listing={listing} />
          <Separator className="my-8" />
          <Description body={listing.description} />
          <Separator className="my-8" />
          <Sleeping bedrooms={listing.bedrooms} />
          <Separator className="my-8" />
          <Amenities items={listing.amenities} />
          <Separator className="my-8" />
          <HostCard host={listing.host} />
        </div>
        <div className="lg:pt-0">
          <ApplyWidget listing={listing} />
        </div>
      </div>
    </main>
  );
}
