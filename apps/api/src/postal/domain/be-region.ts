export const BE_REGIONS = ['flanders', 'wallonia', 'brussels'] as const;
export type BeRegion = (typeof BE_REGIONS)[number];

/**
 * Region inference for a 4-digit Belgian postal code. Single source of truth
 * across the platform — `listing/domain/address.vo` calls this on write, and
 * the seed script calls it to populate `postal_codes.region` per row. By
 * keeping the rule in code (rather than relying on `state_code` from the
 * dataset) the listing context doesn't take a runtime dependency on the
 * postal table to validate an address.
 */
export function inferBeRegion(postalCode: string): BeRegion {
  if (!/^\d{4}$/.test(postalCode)) {
    throw new Error(`Invalid BE postal code: ${postalCode}`);
  }
  const code = Number(postalCode);
  if (code >= 1000 && code <= 1299) return 'brussels';
  if (code >= 1300 && code <= 1499) return 'wallonia';
  if (code >= 1500 && code <= 1999) return 'flanders';
  if (code >= 2000 && code <= 3999) return 'flanders';
  if (code >= 4000 && code <= 7999) return 'wallonia';
  if (code >= 8000 && code <= 9999) return 'flanders';
  throw new Error(`Cannot infer region for postal code: ${postalCode}`);
}
