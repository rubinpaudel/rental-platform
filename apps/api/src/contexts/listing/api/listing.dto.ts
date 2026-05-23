import type { Listing } from '../domain/listing.aggregate';
import type { PaginatedResult } from '../domain/listing.repo';

export function toListingDto(listing: Listing) {
  return {
    id: listing.id,
    orgId: listing.orgId,
    createdBy: listing.createdBy,
    title: listing.title,
    description: listing.description,
    address: {
      street: listing.address.street,
      number: listing.address.number,
      box: listing.address.box,
      postalCode: listing.address.postalCode,
      municipality: listing.address.municipality,
      region: listing.address.region,
      country: listing.address.country,
    },
    price: {
      cents: listing.price.cents,
      currency: listing.price.currency,
    },
    surface: { m2: listing.surface.m2 },
    rooms: listing.rooms,
    status: listing.status,
    photos: listing.photos.map((p) => ({
      storageKey: p.storageKey,
      order: p.order,
      alt: p.alt,
    })),
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}

export function toPublicListingDto(listing: Listing) {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    address: {
      street: listing.address.street,
      number: listing.address.number,
      box: listing.address.box,
      postalCode: listing.address.postalCode,
      municipality: listing.address.municipality,
      region: listing.address.region,
      country: listing.address.country,
    },
    price: {
      cents: listing.price.cents,
      currency: listing.price.currency,
    },
    surface: { m2: listing.surface.m2 },
    rooms: listing.rooms,
    photos: listing.photos.map((p) => ({
      storageKey: p.storageKey,
      order: p.order,
      alt: p.alt,
    })),
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
