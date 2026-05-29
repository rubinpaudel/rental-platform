export interface Surface {
  readonly m2: number;
}

export function surface(m2: number): Surface {
  if (!Number.isInteger(m2) || m2 <= 0) {
    throw new Error('Surface must be a positive integer (m²)');
  }
  return { m2 };
}

export interface SurfaceBreakdown {
  /** Total livable surface (matches `Surface.m2`; required at the aggregate). */
  readonly totalM2: number;
  readonly livingRoomM2: number | null;
  readonly kitchenM2: number | null;
  readonly terraceM2: number | null;
  readonly gardenM2: number | null;
  readonly totalLandM2: number | null;
  readonly basementM2: number | null;
}

export interface SurfaceBreakdownInput {
  totalM2: number;
  livingRoomM2?: number | null;
  kitchenM2?: number | null;
  terraceM2?: number | null;
  gardenM2?: number | null;
  totalLandM2?: number | null;
  basementM2?: number | null;
}

function nonNegIntOrNull(name: string, value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return value;
}

export function surfaceBreakdown(input: SurfaceBreakdownInput): SurfaceBreakdown {
  if (!Number.isInteger(input.totalM2) || input.totalM2 <= 0) {
    throw new Error('totalM2 must be a positive integer');
  }
  return {
    totalM2: input.totalM2,
    livingRoomM2: nonNegIntOrNull('livingRoomM2', input.livingRoomM2),
    kitchenM2: nonNegIntOrNull('kitchenM2', input.kitchenM2),
    terraceM2: nonNegIntOrNull('terraceM2', input.terraceM2),
    gardenM2: nonNegIntOrNull('gardenM2', input.gardenM2),
    totalLandM2: nonNegIntOrNull('totalLandM2', input.totalLandM2),
    basementM2: nonNegIntOrNull('basementM2', input.basementM2),
  };
}
