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

export interface ListingClassification {
  listingType: 'rent' | 'sale' | 'short_term' | 'student';
  propertyType: 'apartment' | 'house' | 'studio' | 'loft' | 'commercial' | 'office' | 'garage' | 'land';
  leaseType: 'long_term_residential' | 'short_term' | 'student' | 'commercial' | null;
  minLeaseMonths: number | null;
}

export interface ListingPricing {
  priceCents: number;
  chargesCents: number | null;
  syndicCents: number | null;
  depositCents: number | null;
  agencyFeeCents: number | null;
  includesUtilities: boolean | null;
  currency: 'EUR';
}

// Shape returned by `GET /listings` (paginated summary). The full detail DTO
// from `GET /listings/:id` is a superset; we'll widen this when an edit/detail
// view actually needs the extra fields.
export interface Listing {
  id: string;
  orgId: string;
  displayLabel: string;
  description: string;
  address: ListingAddress;
  classification: ListingClassification;
  pricing: ListingPricing;
  surface: { totalM2: number };
  bedrooms: number;
  bathrooms: number | null;
  status: ListingStatus;
  coverPhoto: { storageKey: string; alt: string | null } | null;
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

export interface ListingUpsertBody {
  description: string;
  address: {
    street: string;
    number: string;
    box?: string | null;
    postalCode: string;
    municipality: string;
  };
  classification: {
    listingType: 'rent' | 'sale' | 'short_term' | 'student';
    propertyType: 'apartment' | 'house' | 'studio' | 'loft' | 'commercial' | 'office' | 'garage' | 'land';
  };
  pricing: { priceCents: number };
  surface: { totalM2: number };
  roomCounts: { bedrooms: number };
}
