/**
 * DTOs returned by the v3 listing API. Kept in lockstep with
 * `apps/api/src/contexts/listing/api/listing.dto.ts`. Server fetchers and
 * client mutations both consume these types so a backend rename surfaces as
 * a frontend type error immediately.
 */

export const LISTING_STATUSES = ['draft', 'active', 'inactive', 'closed'] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const REGIONS = ['flanders', 'wallonia', 'brussels'] as const;
export type Region = (typeof REGIONS)[number];

export interface ListingAddress {
  street: string;
  number: string;
  box: string | null;
  postalCode: string;
  municipality: string;
  region: Region;
  country: string;
}

export interface ListingPhoto {
  storageKey: string;
  order: number;
  alt: string | null;
}

export interface Listing {
  id: string;
  orgId: string;
  createdBy: string;
  title: string;
  description: string;
  address: ListingAddress;
  price: { cents: number; currency: 'EUR' };
  surface: { m2: number };
  rooms: number;
  status: ListingStatus;
  photos: ListingPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface ListingPage {
  items: Listing[];
  nextCursor: string | null;
}

export interface PresignResponse {
  url: string;
  storageKey: string;
}

/** Payload shape the API expects on `POST /listings` and `PATCH /listings/:id`. */
export interface ListingUpsertBody {
  title: string;
  description: string;
  address: {
    street: string;
    number: string;
    box?: string | null;
    postalCode: string;
    municipality: string;
  };
  priceCents: number;
  surfaceM2: number;
  rooms: number;
}
