import { describe, expect, it } from 'vitest';
import { interiorAmenities, EMPTY_INTERIOR_AMENITIES } from './interior-amenities.vo';

describe('interiorAmenities', () => {
  it('returns empty for empty input', () => {
    expect(interiorAmenities({})).toEqual(EMPTY_INTERIOR_AMENITIES);
  });

  it('round-trips a populated record', () => {
    expect(
      interiorAmenities({
        kitchenType: 'hyper_equipped',
        hasElevator: false,
        hasAlarm: true,
        isFurnished: false,
        videoTourUrl: 'https://example.com/tour',
      }),
    ).toMatchObject({
      kitchenType: 'hyper_equipped',
      hasElevator: false,
      hasAlarm: true,
      isFurnished: false,
      videoTourUrl: 'https://example.com/tour',
    });
  });

  it('rejects invalid kitchenType', () => {
    expect(() => interiorAmenities({ kitchenType: 'galley' })).toThrow(/Invalid kitchenType/);
  });

  it('trims empty videoTourUrl to null', () => {
    expect(interiorAmenities({ videoTourUrl: '   ' }).videoTourUrl).toBeNull();
  });

  it('treats empty-string kitchenType as null', () => {
    expect(interiorAmenities({ kitchenType: '' }).kitchenType).toBeNull();
  });
});
