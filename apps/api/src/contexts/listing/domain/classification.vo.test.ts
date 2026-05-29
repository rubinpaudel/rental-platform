import { describe, expect, it } from 'vitest';
import { classification } from './classification.vo';

describe('classification', () => {
  it('round-trips a full record', () => {
    expect(
      classification({
        listingType: 'rent',
        propertyType: 'apartment',
        leaseType: 'long_term_residential',
        minLeaseMonths: 9,
      }),
    ).toEqual({
      listingType: 'rent',
      propertyType: 'apartment',
      leaseType: 'long_term_residential',
      minLeaseMonths: 9,
    });
  });

  it('accepts minimum required (listingType + propertyType)', () => {
    expect(
      classification({ listingType: 'sale', propertyType: 'house' }),
    ).toEqual({
      listingType: 'sale',
      propertyType: 'house',
      leaseType: null,
      minLeaseMonths: null,
    });
  });

  it('rejects invalid listingType', () => {
    expect(() => classification({ listingType: 'lease', propertyType: 'apartment' })).toThrow(
      /Invalid listingType/,
    );
  });

  it('rejects invalid propertyType', () => {
    expect(() => classification({ listingType: 'rent', propertyType: 'castle' })).toThrow(
      /Invalid propertyType/,
    );
  });

  it('rejects invalid leaseType', () => {
    expect(() =>
      classification({ listingType: 'rent', propertyType: 'apartment', leaseType: 'forever' }),
    ).toThrow(/Invalid leaseType/);
  });

  it('rejects out-of-range minLeaseMonths', () => {
    expect(() =>
      classification({ listingType: 'rent', propertyType: 'apartment', minLeaseMonths: 0 }),
    ).toThrow(/between 1 and 360/);
    expect(() =>
      classification({ listingType: 'rent', propertyType: 'apartment', minLeaseMonths: 361 }),
    ).toThrow(/between 1 and 360/);
  });

  it('rejects non-integer minLeaseMonths', () => {
    expect(() =>
      classification({ listingType: 'rent', propertyType: 'apartment', minLeaseMonths: 9.5 }),
    ).toThrow(/integer/);
  });
});
