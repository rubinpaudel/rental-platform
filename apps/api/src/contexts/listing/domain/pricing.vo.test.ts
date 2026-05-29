import { describe, expect, it } from 'vitest';
import { pricing } from './pricing.vo';

describe('pricing', () => {
  it('parses a minimal record', () => {
    expect(pricing({ priceCents: 95000 })).toEqual({
      priceCents: 95000,
      chargesCents: null,
      syndicCents: null,
      depositCents: null,
      agencyFeeCents: null,
      includesUtilities: null,
      currency: 'EUR',
    });
  });

  it('round-trips a full record', () => {
    expect(
      pricing({
        priceCents: 120000,
        chargesCents: 15000,
        syndicCents: 5000,
        depositCents: 240000,
        agencyFeeCents: 60000,
        includesUtilities: true,
        currency: 'EUR',
      }),
    ).toEqual({
      priceCents: 120000,
      chargesCents: 15000,
      syndicCents: 5000,
      depositCents: 240000,
      agencyFeeCents: 60000,
      includesUtilities: true,
      currency: 'EUR',
    });
  });

  it('rejects negative priceCents', () => {
    expect(() => pricing({ priceCents: -1 })).toThrow(/non-negative/);
  });

  it('rejects non-integer priceCents', () => {
    expect(() => pricing({ priceCents: 99.99 })).toThrow(/non-negative integer/);
  });

  it('rejects negative auxiliary money fields', () => {
    expect(() => pricing({ priceCents: 1000, chargesCents: -1 })).toThrow(/non-negative/);
    expect(() => pricing({ priceCents: 1000, depositCents: -1 })).toThrow(/non-negative/);
  });

  it('rejects non-EUR currency', () => {
    expect(() => pricing({ priceCents: 1000, currency: 'USD' })).toThrow(/Only EUR/);
  });
});
