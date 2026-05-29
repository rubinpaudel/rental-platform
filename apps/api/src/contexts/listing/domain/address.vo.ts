export const REGIONS = ['flanders', 'wallonia', 'brussels'] as const;
export type Region = (typeof REGIONS)[number];

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

export interface AddressInput {
  street: string;
  number: string;
  box?: string | null;
  postalCode: string;
  municipality: string;
  country?: string;
}

export function inferRegion(postalCode: string): Region {
  const code = Number(postalCode);
  if (code >= 1000 && code <= 1299) return 'brussels';
  if (code >= 1300 && code <= 1499) return 'wallonia';
  if (code >= 1500 && code <= 1999) return 'flanders';
  if (code >= 2000 && code <= 3999) return 'flanders';
  if (code >= 4000 && code <= 7999) return 'wallonia';
  if (code >= 8000 && code <= 9999) return 'flanders';
  throw new Error(`Cannot infer region for postal code: ${postalCode}`);
}

export function address(input: AddressInput): Address {
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
    region: inferRegion(postalCode),
    country,
  };
}
