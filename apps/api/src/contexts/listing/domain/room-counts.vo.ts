export interface RoomCounts {
  readonly bedrooms: number;
  readonly bathrooms: number | null;
  readonly showerRooms: number | null;
  readonly toilets: number | null;
  readonly hasOffice: boolean | null;
  readonly hasDressing: boolean | null;
  readonly hasLaundry: boolean | null;
}

export interface RoomCountsInput {
  bedrooms: number;
  bathrooms?: number | null;
  showerRooms?: number | null;
  toilets?: number | null;
  hasOffice?: boolean | null;
  hasDressing?: boolean | null;
  hasLaundry?: boolean | null;
}

function nonNegIntOrNull(name: string, value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return value;
}

export function roomCounts(input: RoomCountsInput): RoomCounts {
  if (!Number.isInteger(input.bedrooms) || input.bedrooms < 0) {
    throw new Error('bedrooms must be a non-negative integer');
  }
  return {
    bedrooms: input.bedrooms,
    bathrooms: nonNegIntOrNull('bathrooms', input.bathrooms),
    showerRooms: nonNegIntOrNull('showerRooms', input.showerRooms),
    toilets: nonNegIntOrNull('toilets', input.toilets),
    hasOffice: input.hasOffice ?? null,
    hasDressing: input.hasDressing ?? null,
    hasLaundry: input.hasLaundry ?? null,
  };
}
