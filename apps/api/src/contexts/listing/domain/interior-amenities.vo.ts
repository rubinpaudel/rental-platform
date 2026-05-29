import { kitchenType, type KitchenType } from './kitchen.vo';

export interface InteriorAmenities {
  readonly kitchenType: KitchenType | null;
  readonly hasElevator: boolean | null;
  readonly hasIntercom: boolean | null;
  readonly hasAlarm: boolean | null;
  readonly hasArmoredDoor: boolean | null;
  readonly hasAirConditioning: boolean | null;
  readonly hasInternetAvailable: boolean | null;
  readonly hasCableTv: boolean | null;
  readonly hasVideoPhone: boolean | null;
  readonly isAccessibleReducedMobility: boolean | null;
  readonly isFurnished: boolean | null;
  /** Marketing video URL — domain-validated only as a non-empty string. */
  readonly videoTourUrl: string | null;
}

export interface InteriorAmenitiesInput {
  kitchenType?: string | null;
  hasElevator?: boolean | null;
  hasIntercom?: boolean | null;
  hasAlarm?: boolean | null;
  hasArmoredDoor?: boolean | null;
  hasAirConditioning?: boolean | null;
  hasInternetAvailable?: boolean | null;
  hasCableTv?: boolean | null;
  hasVideoPhone?: boolean | null;
  isAccessibleReducedMobility?: boolean | null;
  isFurnished?: boolean | null;
  videoTourUrl?: string | null;
}

export function interiorAmenities(input: InteriorAmenitiesInput): InteriorAmenities {
  const kt = input.kitchenType == null || input.kitchenType === '' ? null : kitchenType(input.kitchenType);
  const url = input.videoTourUrl?.trim() || null;
  return {
    kitchenType: kt,
    hasElevator: input.hasElevator ?? null,
    hasIntercom: input.hasIntercom ?? null,
    hasAlarm: input.hasAlarm ?? null,
    hasArmoredDoor: input.hasArmoredDoor ?? null,
    hasAirConditioning: input.hasAirConditioning ?? null,
    hasInternetAvailable: input.hasInternetAvailable ?? null,
    hasCableTv: input.hasCableTv ?? null,
    hasVideoPhone: input.hasVideoPhone ?? null,
    isAccessibleReducedMobility: input.isAccessibleReducedMobility ?? null,
    isFurnished: input.isFurnished ?? null,
    videoTourUrl: url,
  };
}

export const EMPTY_INTERIOR_AMENITIES: InteriorAmenities = {
  kitchenType: null,
  hasElevator: null,
  hasIntercom: null,
  hasAlarm: null,
  hasArmoredDoor: null,
  hasAirConditioning: null,
  hasInternetAvailable: null,
  hasCableTv: null,
  hasVideoPhone: null,
  isAccessibleReducedMobility: null,
  isFurnished: null,
  videoTourUrl: null,
};
