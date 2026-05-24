const PET_DESCRIPTION_MAX = 500;

export interface Household {
  readonly householdSize: number | null;
  readonly hasPets: boolean | null;
  readonly petDescription: string | null;
}

export const EMPTY_HOUSEHOLD: Household = {
  householdSize: null,
  hasPets: null,
  petDescription: null,
};

export interface HouseholdInput {
  householdSize?: number | null;
  hasPets?: boolean | null;
  petDescription?: string | null;
}

export function household(input: HouseholdInput): Household {
  const size = normaliseSize(input.householdSize);
  const hasPets = input.hasPets == null ? null : Boolean(input.hasPets);
  const petDescription = normalisePetDescription(input.petDescription);

  if (petDescription !== null && hasPets === false) {
    throw new Error('petDescription cannot be set when hasPets is false');
  }

  return { householdSize: size, hasPets, petDescription };
}

function normaliseSize(value: number | null | undefined): number | null {
  if (value == null) return null;
  if (!Number.isInteger(value) || value < 1 || value > 20) {
    throw new Error('householdSize must be an integer between 1 and 20');
  }
  return value;
}

function normalisePetDescription(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (trimmed === '') return null;
  if (trimmed.length > PET_DESCRIPTION_MAX) {
    throw new Error(`petDescription must be at most ${PET_DESCRIPTION_MAX} characters`);
  }
  return trimmed;
}
