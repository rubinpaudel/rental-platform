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
