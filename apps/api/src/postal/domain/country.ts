/**
 * ISO 3166-1 alpha-2 country codes the postal module knows how to look up.
 * Adding a new country = drop its rows into the `postal_codes` table (the
 * seed script handles this from a JSON dataset) and extend this union.
 * No controller / DTO change needed.
 */
export const SUPPORTED_COUNTRIES = ['BE'] as const;
export type Country = (typeof SUPPORTED_COUNTRIES)[number];

export const DEFAULT_COUNTRY: Country = 'BE';

export function isSupportedCountry(value: string): value is Country {
  return (SUPPORTED_COUNTRIES as readonly string[]).includes(value);
}
