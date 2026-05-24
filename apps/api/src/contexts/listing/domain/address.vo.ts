import { BE_REGIONS, type BeRegion, inferBeRegion } from '../../../postal/domain/be-region';

/**
 * Region for a BE address. Re-exported from the postal module so postcode
 * → region derivation has one source of truth across the platform.
 */
export const REGIONS = BE_REGIONS;
export type Region = BeRegion;

/** ISO 3166-1 alpha-2 country code. */
export type CountryCode = string & { readonly __brand: 'CountryCode' };

export function countryCode(value: string): CountryCode {
  if (!/^[A-Z]{2}$/.test(value)) {
    throw new Error(`Invalid ISO 3166-1 alpha-2 country code: ${value}`);
  }
  return value as CountryCode;
}

export const DEFAULT_COUNTRY: CountryCode = 'BE' as CountryCode;

export interface Address {
  readonly street: string;
  readonly number: string;
  readonly box: string | null;
  readonly postalCode: string;
  readonly municipality: string;
  readonly region: Region;
  readonly country: CountryCode;
}

export function address(input: {
  street: string;
  number: string;
  box?: string | null;
  postalCode: string;
  municipality: string;
  country?: string;
}): Address {
  const { street, number, postalCode, municipality } = input;
  if (!street) throw new Error('Street is required');
  if (!number) throw new Error('Number is required');
  if (!/^\d{4}$/.test(postalCode)) {
    throw new Error('Postal code must be exactly 4 digits');
  }
  if (!municipality) throw new Error('Municipality is required');

  const country = input.country ? countryCode(input.country) : DEFAULT_COUNTRY;

  return {
    street,
    number,
    box: input.box ?? null,
    postalCode,
    municipality,
    region: inferBeRegion(postalCode),
    country,
  };
}
