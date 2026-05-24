// keep in sync with listings_building_condition_chk
export const BUILDING_CONDITIONS = [
  'new',
  'excellent',
  'good',
  'to_refresh',
  'to_renovate',
] as const;
export type BuildingCondition = (typeof BUILDING_CONDITIONS)[number];

export interface BuildingProfile {
  readonly yearBuilt: number | null;
  readonly floor: number | null;
  readonly totalFloors: number | null;
  readonly condition: BuildingCondition | null;
  readonly facadeCount: number | null;
}

export interface BuildingInput {
  yearBuilt?: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  condition?: string | null;
  facadeCount?: number | null;
}

function intInRangeOrNull(
  name: string,
  value: number | null | undefined,
  min: number,
  max: number,
): number | null {
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

export function buildingProfile(input: BuildingInput): BuildingProfile {
  const condition = input.condition ?? null;
  if (condition !== null && !BUILDING_CONDITIONS.includes(condition as BuildingCondition)) {
    throw new Error(`Invalid building condition: ${condition}`);
  }
  return {
    yearBuilt: intInRangeOrNull('yearBuilt', input.yearBuilt, 1000, 2100),
    floor: intInRangeOrNull('floor', input.floor, -5, 200),
    totalFloors: intInRangeOrNull('totalFloors', input.totalFloors, 1, 200),
    condition: condition as BuildingCondition | null,
    facadeCount: intInRangeOrNull('facadeCount', input.facadeCount, 1, 4),
  };
}

export const EMPTY_BUILDING_PROFILE: BuildingProfile = {
  yearBuilt: null,
  floor: null,
  totalFloors: null,
  condition: null,
  facadeCount: null,
};
