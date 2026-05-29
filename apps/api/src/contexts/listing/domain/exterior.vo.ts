// keep in sync with listings_orientation_chk
export const ORIENTATIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

export interface Exterior {
  readonly hasTerrace: boolean | null;
  readonly hasGarden: boolean | null;
  readonly hasGarage: boolean | null;
  readonly parkingSpots: number | null;
  readonly orientation: Orientation | null;
}

export interface ExteriorInput {
  hasTerrace?: boolean | null;
  hasGarden?: boolean | null;
  hasGarage?: boolean | null;
  parkingSpots?: number | null;
  orientation?: string | null;
}

export function exterior(input: ExteriorInput): Exterior {
  let parkingSpots: number | null = null;
  if (input.parkingSpots !== null && input.parkingSpots !== undefined) {
    if (!Number.isInteger(input.parkingSpots) || input.parkingSpots < 0) {
      throw new Error('parkingSpots must be a non-negative integer');
    }
    parkingSpots = input.parkingSpots;
  }
  const orientation = input.orientation ?? null;
  if (orientation !== null && !ORIENTATIONS.includes(orientation as Orientation)) {
    throw new Error(`Invalid orientation: ${orientation}`);
  }
  return {
    hasTerrace: input.hasTerrace ?? null,
    hasGarden: input.hasGarden ?? null,
    hasGarage: input.hasGarage ?? null,
    parkingSpots,
    orientation: orientation as Orientation | null,
  };
}

export const EMPTY_EXTERIOR: Exterior = {
  hasTerrace: null,
  hasGarden: null,
  hasGarage: null,
  parkingSpots: null,
  orientation: null,
};
