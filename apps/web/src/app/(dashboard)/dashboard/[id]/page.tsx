import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, House, Image as ImageIcon, Pencil } from 'lucide-react';
import { getTranslator } from '@rental-platform/i18n';
import {
  Badge,
  Button,
  Separator,
  buttonVariants,
} from '@rental-platform/ui';
import { getListingOrNull } from '@/lib/listings/queries';
import { formatAddress, formatDate, formatPrice } from '@/features/listings/format';
import type { Listing, ListingStatus } from '@/lib/listings/types';

const t = getTranslator();

const STATUS_VARIANT: Record<ListingStatus, 'default' | 'outline' | 'secondary'> = {
  draft: 'outline',
  active: 'default',
  inactive: 'secondary',
  closed: 'outline',
};

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingOrNull(id);
  if (!listing) notFound();

  return (
    <div className="flex flex-col">
      <Link
        href="/dashboard"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground hover:text-foreground/70"
      >
        <ArrowLeft className="size-4" />
        {t('listings.detail.back')}
      </Link>

      <Hero alt={listing.coverPhoto?.alt ?? listing.displayLabel} />

      <header className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            {formatAddress(listing.address)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {listing.displayLabel}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[listing.status]} className="h-6 px-2.5">
          {t(`listings.status.${listing.status}` as const)}
        </Badge>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          href={`/listing/${listing.id}/basics`}
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          <Pencil />
          {t('listings.detail.edit')}
        </Link>
        <Link
          href={`/listing/${listing.id}/photos`}
          className={buttonVariants({ variant: 'outline', size: 'sm' })}
        >
          <ImageIcon />
          {t('listings.detail.photos.cta')}
        </Link>
        <Button size="sm">
          {listing.status === 'active'
            ? t('listings.detail.deactivate')
            : t('listings.detail.activate')}
        </Button>
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
        <BasicsSection listing={listing} />
        <PricingSection listing={listing} />
      </div>

      {listing.description ? (
        <>
          <Separator className="my-8" />
          <section>
            <SectionTitle>{t('listings.detail.section.description')}</SectionTitle>
            <p className="mt-3 max-w-[65ch] text-sm leading-relaxed whitespace-pre-line text-foreground">
              {listing.description}
            </p>
          </section>
        </>
      ) : null}

      <Separator className="my-8" />

      <footer className="flex flex-col gap-1 text-xs text-muted-foreground tabular-nums sm:flex-row sm:gap-6">
        <span>
          {t('listings.detail.timestamps.created', { date: formatDate(listing.createdAt) })}
        </span>
        <span>
          {t('listings.detail.timestamps.updated', { date: formatDate(listing.updatedAt) })}
        </span>
      </footer>
    </div>
  );
}

function Hero({ alt }: { alt: string }) {
  // Cover-photo signed URLs come from the photo manager flow; until that
  // wires through to the detail DTO, render a typographic placeholder so
  // the page reads as a real surface instead of a broken image.
  return (
    <div
      className="mt-6 flex aspect-[2.4/1] w-full items-center justify-center overflow-hidden rounded-2xl bg-muted text-muted-foreground/40"
      role="img"
      aria-label={alt}
    >
      <House className="size-16" />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-medium text-foreground">{children}</h2>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground tabular-nums">{value}</dd>
    </div>
  );
}

function BasicsSection({ listing }: { listing: Listing }) {
  const { classification, surface, bedrooms, bathrooms } = listing;
  return (
    <section>
      <SectionTitle>{t('listings.detail.section.basics')}</SectionTitle>
      <dl className="mt-3">
        <Field
          label={t('listings.detail.field.propertyType')}
          value={t(`listings.detail.propertyType.${classification.propertyType}` as const)}
        />
        {classification.leaseType ? (
          <Field
            label={t('listings.detail.field.leaseType')}
            value={t(`listings.detail.leaseType.${classification.leaseType}` as const)}
          />
        ) : null}
        {classification.minLeaseMonths ? (
          <Field
            label={t('listings.detail.field.minLease')}
            value={t('listings.detail.field.minLeaseValue', {
              months: classification.minLeaseMonths,
            })}
          />
        ) : null}
        <Field
          label={t('listings.detail.field.bedrooms')}
          value={String(bedrooms)}
        />
        {bathrooms != null ? (
          <Field
            label={t('listings.detail.field.bathrooms')}
            value={String(bathrooms)}
          />
        ) : null}
        <Field
          label={t('listings.detail.field.surface')}
          value={`${surface.totalM2} m²`}
        />
      </dl>
    </section>
  );
}

function PricingSection({ listing }: { listing: Listing }) {
  const { pricing } = listing;
  return (
    <section>
      <SectionTitle>{t('listings.detail.section.pricing')}</SectionTitle>
      <dl className="mt-3">
        <Field
          label={t('listings.detail.price.rent')}
          value={formatPrice(pricing.priceCents)}
        />
        {pricing.chargesCents != null ? (
          <Field
            label={t('listings.detail.price.charges')}
            value={formatPrice(pricing.chargesCents)}
          />
        ) : null}
        {pricing.syndicCents != null ? (
          <Field
            label={t('listings.detail.price.syndic')}
            value={formatPrice(pricing.syndicCents)}
          />
        ) : null}
        {pricing.depositCents != null ? (
          <Field
            label={t('listings.detail.price.deposit')}
            value={formatPrice(pricing.depositCents)}
          />
        ) : null}
        {pricing.agencyFeeCents != null ? (
          <Field
            label={t('listings.detail.price.agencyFee')}
            value={formatPrice(pricing.agencyFeeCents)}
          />
        ) : null}
      </dl>
      {pricing.includesUtilities ? (
        <p className="mt-3 text-xs text-muted-foreground">
          {t('listings.detail.price.includesUtilities')}
        </p>
      ) : null}
    </section>
  );
}
