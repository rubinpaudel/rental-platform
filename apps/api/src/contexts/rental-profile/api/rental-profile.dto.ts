import type { RentalProfile } from '../domain/rental-profile.aggregate';

export function toRentalProfileDto(profile: RentalProfile) {
  return {
    userId: profile.userId,
    identity: {
      firstName: profile.identity.firstName,
      lastName: profile.identity.lastName,
      dateOfBirth: profile.identity.dateOfBirth,
      phone: profile.identity.phone,
      nationality: profile.identity.nationality,
    },
    household: {
      householdSize: profile.household.householdSize,
      hasPets: profile.household.hasPets,
      petDescription: profile.household.petDescription,
    },
    employment: {
      status: profile.employment.status,
      employer: profile.employment.employer,
      monthsAtEmployer: profile.employment.monthsAtEmployer,
    },
    financial: {
      monthlyNetIncomeCents: profile.financial.monthlyNetIncomeCents,
      incomeProofType: profile.financial.incomeProofType,
      guaranteeCapacityCents: profile.financial.guaranteeCapacityCents,
    },
    move: {
      desiredMoveInDate: profile.move.desiredMoveInDate,
      willingToDomicile: profile.move.willingToDomicile,
    },
    bio: profile.bio,
    completeness: profile.completeness(),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export type RentalProfileDto = ReturnType<typeof toRentalProfileDto>;
