// keep in sync with listings_listing_type_chk
export const LISTING_TYPES = ['rent', 'sale', 'short_term', 'student'] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

// keep in sync with listings_property_type_chk
export const PROPERTY_TYPES = [
  'apartment',
  'house',
  'studio',
  'loft',
  'commercial',
  'office',
  'garage',
  'land',
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

// keep in sync with listings_lease_type_chk
export const LEASE_TYPES = ['residential_9y', 'short_term', 'student', 'commercial'] as const;
export type LeaseType = (typeof LEASE_TYPES)[number];

export interface Classification {
  readonly listingType: ListingType;
  readonly propertyType: PropertyType;
  readonly leaseType: LeaseType | null;
  readonly minLeaseMonths: number | null;
}

export function classification(input: {
  listingType: string;
  propertyType: string;
  leaseType?: string | null;
  minLeaseMonths?: number | null;
}): Classification {
  if (!LISTING_TYPES.includes(input.listingType as ListingType)) {
    throw new Error(`Invalid listingType: ${input.listingType}`);
  }
  if (!PROPERTY_TYPES.includes(input.propertyType as PropertyType)) {
    throw new Error(`Invalid propertyType: ${input.propertyType}`);
  }
  const leaseType = input.leaseType ?? null;
  if (leaseType !== null && !LEASE_TYPES.includes(leaseType as LeaseType)) {
    throw new Error(`Invalid leaseType: ${leaseType}`);
  }
  const minLeaseMonths = input.minLeaseMonths ?? null;
  if (minLeaseMonths !== null) {
    if (!Number.isInteger(minLeaseMonths) || minLeaseMonths < 1 || minLeaseMonths > 360) {
      throw new Error('minLeaseMonths must be an integer between 1 and 360');
    }
  }

  return {
    listingType: input.listingType as ListingType,
    propertyType: input.propertyType as PropertyType,
    leaseType: leaseType as LeaseType | null,
    minLeaseMonths,
  };
}
