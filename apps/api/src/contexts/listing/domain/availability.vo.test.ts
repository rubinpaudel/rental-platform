import { describe, expect, it } from 'vitest';
import { availability } from './availability.vo';

describe('availability', () => {
  it('returns all nulls for empty input', () => {
    expect(availability({})).toEqual({
      availableFrom: null,
      availableImmediately: null,
      viewingMode: null,
    });
  });

  it('round-trips a full record', () => {
    expect(
      availability({
        availableFrom: '2026-07-01',
        availableImmediately: false,
        viewingMode: 'on_request',
      }),
    ).toEqual({
      availableFrom: '2026-07-01',
      availableImmediately: false,
      viewingMode: 'on_request',
    });
  });

  it('rejects malformed availableFrom date', () => {
    expect(() => availability({ availableFrom: '01-07-2026' })).toThrow(/YYYY-MM-DD/);
    expect(() => availability({ availableFrom: '2026/07/01' })).toThrow(/YYYY-MM-DD/);
  });

  it('rejects unknown viewingMode', () => {
    expect(() => availability({ viewingMode: 'whenever' })).toThrow(/Invalid viewingMode/);
  });

  it('treats empty-string availableFrom as null', () => {
    expect(availability({ availableFrom: '' }).availableFrom).toBeNull();
  });
});
