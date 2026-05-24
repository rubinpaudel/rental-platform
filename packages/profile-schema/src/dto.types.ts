import type { EmploymentStatus, IncomeProofType } from './enums';

// Shape returned by `GET /me/profile`. Mirrors `toProfileDto` in
// apps/api/src/contexts/profile/api/profile.dto.ts. Kept as a type (not a
// Zod schema) because clients don't validate responses — they trust them.
// If the server contract drifts, TypeScript catches it at the call site.
//
// Response fields are stricter than the patch input — the server has run
// the value objects so enum fields are narrowed to their union types and
// every section field is present (null when unset, never `undefined`).

export interface IdentitySection {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  nationality: string | null;
}

export interface HouseholdSection {
  householdSize: number | null;
  hasPets: boolean | null;
  petDescription: string | null;
}

export interface EmploymentSection {
  status: EmploymentStatus | null;
  employer: string | null;
  monthsAtEmployer: number | null;
}

export interface FinancialSection {
  monthlyNetIncomeCents: number | null;
  incomeProofType: IncomeProofType | null;
  guaranteeCapacityCents: number | null;
}

export interface MoveSection {
  desiredMoveInDate: string | null;
  willingToDomicile: boolean | null;
}

export interface ProfileDto {
  userId: string;
  identity: IdentitySection;
  household: HouseholdSection;
  employment: EmploymentSection;
  financial: FinancialSection;
  move: MoveSection;
  bio: string;
  completeness: number;
  createdAt: string;
  updatedAt: string;
}
