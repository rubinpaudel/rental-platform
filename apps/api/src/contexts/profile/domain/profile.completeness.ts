import type { Profile } from './profile.aggregate';

/**
 * Field weights for the completeness score (sum = 100).
 *
 * Required fields (identity essentials, employment status, income, guarantee,
 * household size) carry the bulk of the score. Optional fields (employer
 * details, pets, move date, bio) round out to 100% once filled.
 */
export const PROFILE_WEIGHTS = {
  firstName: 7,
  lastName: 7,
  dateOfBirth: 6,
  phone: 6,
  nationality: 4,
  householdSize: 10,
  employmentStatus: 12,
  monthlyNetIncomeCents: 14,
  incomeProofType: 4,
  guaranteeCapacityCents: 12,
  willingToDomicile: 4,
  hasPets: 3,
  employer: 3,
  monthsAtEmployer: 3,
  desiredMoveInDate: 3,
  bio: 2,
} as const;

/** 0..100 weighted percentage of filled fields. */
export function completenessOf(profile: Profile): number {
  let score = 0;

  if (profile.identity.firstName !== null) score += PROFILE_WEIGHTS.firstName;
  if (profile.identity.lastName !== null) score += PROFILE_WEIGHTS.lastName;
  if (profile.identity.dateOfBirth !== null) score += PROFILE_WEIGHTS.dateOfBirth;
  if (profile.identity.phone !== null) score += PROFILE_WEIGHTS.phone;
  if (profile.identity.nationality !== null) score += PROFILE_WEIGHTS.nationality;

  if (profile.household.householdSize !== null) score += PROFILE_WEIGHTS.householdSize;
  if (profile.household.hasPets !== null) score += PROFILE_WEIGHTS.hasPets;

  if (profile.employment.status !== null) score += PROFILE_WEIGHTS.employmentStatus;
  if (profile.employment.employer !== null) score += PROFILE_WEIGHTS.employer;
  if (profile.employment.monthsAtEmployer !== null) score += PROFILE_WEIGHTS.monthsAtEmployer;

  if (profile.financial.monthlyNetIncomeCents !== null) score += PROFILE_WEIGHTS.monthlyNetIncomeCents;
  if (profile.financial.incomeProofType !== null) score += PROFILE_WEIGHTS.incomeProofType;
  if (profile.financial.guaranteeCapacityCents !== null) score += PROFILE_WEIGHTS.guaranteeCapacityCents;

  if (profile.move.willingToDomicile !== null) score += PROFILE_WEIGHTS.willingToDomicile;
  if (profile.move.desiredMoveInDate !== null) score += PROFILE_WEIGHTS.desiredMoveInDate;

  if (profile.bio.trim().length > 0) score += PROFILE_WEIGHTS.bio;

  return Math.min(100, score);
}
