import type { Region } from '@/lib/listings/types';

/**
 * Region inference from a 4-digit BE postal code. Mirrors the backend domain
 * helper at apps/api/src/contexts/listing/domain/address.vo.ts so the value
 * we precompute on the client matches what the API derives server-side on
 * submit.
 */
export function inferRegion(postalCode: string): Region | null {
  if (!/^\d{4}$/.test(postalCode)) return null;
  const code = Number(postalCode);
  if (code >= 1000 && code <= 1299) return 'brussels';
  if (code >= 1300 && code <= 1499) return 'wallonia';
  if (code >= 1500 && code <= 1999) return 'flanders';
  if (code >= 2000 && code <= 3999) return 'flanders';
  if (code >= 4000 && code <= 7999) return 'wallonia';
  if (code >= 8000 && code <= 9999) return 'flanders';
  return null;
}
