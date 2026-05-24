import type { Listing } from '../domain/listing.aggregate';
import type { PaginatedResult } from '../domain/listing.repo';

function displayLabel(listing: Listing): string {
  return `${listing.classification.propertyType} in ${listing.address.municipality}, ${listing.address.postalCode}`;
}

function addressDto(listing: Listing) {
  return {
    street: listing.address.street,
    number: listing.address.number,
    box: listing.address.box,
    postalCode: listing.address.postalCode,
    municipality: listing.address.municipality,
    region: listing.address.region,
    country: listing.address.country,
  };
}

function pricingDto(listing: Listing) {
  return {
    priceCents: listing.pricing.priceCents,
    chargesCents: listing.pricing.chargesCents,
    syndicCents: listing.pricing.syndicCents,
    depositCents: listing.pricing.depositCents,
    agencyFeeCents: listing.pricing.agencyFeeCents,
    includesUtilities: listing.pricing.includesUtilities,
    currency: listing.pricing.currency,
  };
}

function classificationDto(listing: Listing) {
  return {
    listingType: listing.classification.listingType,
    propertyType: listing.classification.propertyType,
    leaseType: listing.classification.leaseType,
    minLeaseMonths: listing.classification.minLeaseMonths,
  };
}

function availabilityDto(listing: Listing) {
  return {
    availableFrom: listing.availability.availableFrom,
    availableImmediately: listing.availability.availableImmediately,
    viewingMode: listing.availability.viewingMode,
  };
}

function photosDto(listing: Listing) {
  return listing.photos.map((p) => ({
    storageKey: p.storageKey,
    order: p.order,
    alt: p.alt,
  }));
}

/** Lightweight shape for feed/list views: enough to render a listing card. */
export function toListingSummaryDto(listing: Listing) {
  return {
    id: listing.id,
    orgId: listing.orgId,
    displayLabel: displayLabel(listing),
    description: listing.description,
    address: addressDto(listing),
    classification: classificationDto(listing),
    pricing: pricingDto(listing),
    surface: { m2: listing.surface.m2 },
    bedrooms: listing.bedrooms,
    status: listing.status,
    coverPhoto: listing.photos[0]
      ? { storageKey: listing.photos[0].storageKey, alt: listing.photos[0].alt }
      : null,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}

/** Full shape for detail/edit views. */
export function toListingDetailDto(listing: Listing) {
  return {
    id: listing.id,
    orgId: listing.orgId,
    createdBy: listing.createdBy,
    displayLabel: displayLabel(listing),
    description: listing.description,
    address: addressDto(listing),
    classification: classificationDto(listing),
    availability: availabilityDto(listing),
    pricing: pricingDto(listing),
    surface: { m2: listing.surface.m2 },
    bedrooms: listing.bedrooms,
    status: listing.status,
    photos: photosDto(listing),
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}

/** Public-facing detail (strips org/creator identifiers). */
export function toPublicListingDto(listing: Listing) {
  return {
    id: listing.id,
    displayLabel: displayLabel(listing),
    description: listing.description,
    address: addressDto(listing),
    classification: classificationDto(listing),
    availability: availabilityDto(listing),
    pricing: pricingDto(listing),
    surface: { m2: listing.surface.m2 },
    bedrooms: listing.bedrooms,
    photos: photosDto(listing),
    createdAt: listing.createdAt.toISOString(),
  };
}

export function toPaginatedDto<T>(
  result: PaginatedResult<T>,
  mapper: (item: T) => unknown,
) {
  return {
    items: result.items.map(mapper),
    nextCursor: result.nextCursor,
  };
}
