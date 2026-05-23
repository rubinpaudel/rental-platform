import type { UserId } from '../../identity/domain/user-id.vo';
import type { Identity, IdentityInput } from './identity.vo';
import { identity, EMPTY_IDENTITY } from './identity.vo';
import type { Household, HouseholdInput } from './household.vo';
import { household, EMPTY_HOUSEHOLD } from './household.vo';
import type { Employment, EmploymentInput } from './employment.vo';
import { employment, EMPTY_EMPLOYMENT } from './employment.vo';
import type { Financial, FinancialInput } from './financial.vo';
import { financial, EMPTY_FINANCIAL } from './financial.vo';
import type { MoveIntent, MoveIntentInput } from './move-intent.vo';
import { moveIntent, EMPTY_MOVE_INTENT } from './move-intent.vo';

export const BIO_MAX = 1000;

export interface RentalProfileProps {
  userId: UserId;
  identity: Identity;
  household: Household;
  employment: Employment;
  financial: Financial;
  move: MoveIntent;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RentalProfilePatch {
  identity?: IdentityInput;
  household?: HouseholdInput;
  employment?: EmploymentInput;
  financial?: FinancialInput;
  move?: MoveIntentInput;
  bio?: string | null;
}

/**
 * Field weights for the completeness score (sum = 100).
 *
 * Required fields (identity essentials, employment status, income, guarantee,
 * household size) carry the bulk of the score. Optional fields (employer
 * details, pets, move date, bio) round out to 100% once filled.
 */
const WEIGHTS = {
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

export class RentalProfile {
  readonly userId: UserId;
  identity: Identity;
  household: Household;
  employment: Employment;
  financial: Financial;
  move: MoveIntent;
  bio: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: RentalProfileProps) {
    this.userId = props.userId;
    this.identity = props.identity;
    this.household = props.household;
    this.employment = props.employment;
    this.financial = props.financial;
    this.move = props.move;
    this.bio = props.bio;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static empty(userId: UserId, now: Date = new Date()): RentalProfile {
    return new RentalProfile({
      userId,
      identity: EMPTY_IDENTITY,
      household: EMPTY_HOUSEHOLD,
      employment: EMPTY_EMPLOYMENT,
      financial: EMPTY_FINANCIAL,
      move: EMPTY_MOVE_INTENT,
      bio: '',
      createdAt: now,
      updatedAt: now,
    });
  }

  patch(input: RentalProfilePatch): void {
    if (input.identity !== undefined) {
      this.identity = identity({ ...this.identity, ...input.identity });
    }
    if (input.household !== undefined) {
      this.household = household({ ...this.household, ...input.household });
    }
    if (input.employment !== undefined) {
      this.employment = employment({ ...this.employment, ...input.employment });
    }
    if (input.financial !== undefined) {
      this.financial = financial({ ...this.financial, ...input.financial });
    }
    if (input.move !== undefined) {
      this.move = moveIntent({ ...this.move, ...input.move });
    }
    if (input.bio !== undefined) {
      this.bio = normaliseBio(input.bio ?? '');
    }
    this.updatedAt = new Date();
  }

  replace(input: RentalProfilePatch): void {
    this.identity = identity(input.identity ?? {});
    this.household = household(input.household ?? {});
    this.employment = employment(input.employment ?? {});
    this.financial = financial(input.financial ?? {});
    this.move = moveIntent(input.move ?? {});
    this.bio = normaliseBio(input.bio ?? '');
    this.updatedAt = new Date();
  }

  /** 0..100 weighted percentage of filled fields. */
  completeness(): number {
    let score = 0;

    if (this.identity.firstName !== null) score += WEIGHTS.firstName;
    if (this.identity.lastName !== null) score += WEIGHTS.lastName;
    if (this.identity.dateOfBirth !== null) score += WEIGHTS.dateOfBirth;
    if (this.identity.phone !== null) score += WEIGHTS.phone;
    if (this.identity.nationality !== null) score += WEIGHTS.nationality;

    if (this.household.householdSize !== null) score += WEIGHTS.householdSize;
    if (this.household.hasPets !== null) score += WEIGHTS.hasPets;

    if (this.employment.status !== null) score += WEIGHTS.employmentStatus;
    if (this.employment.employer !== null) score += WEIGHTS.employer;
    if (this.employment.monthsAtEmployer !== null) score += WEIGHTS.monthsAtEmployer;

    if (this.financial.monthlyNetIncomeCents !== null) score += WEIGHTS.monthlyNetIncomeCents;
    if (this.financial.incomeProofType !== null) score += WEIGHTS.incomeProofType;
    if (this.financial.guaranteeCapacityCents !== null) score += WEIGHTS.guaranteeCapacityCents;

    if (this.move.willingToDomicile !== null) score += WEIGHTS.willingToDomicile;
    if (this.move.desiredMoveInDate !== null) score += WEIGHTS.desiredMoveInDate;

    if (this.bio.trim().length > 0) score += WEIGHTS.bio;

    return Math.min(100, score);
  }
}

function normaliseBio(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length > BIO_MAX) {
    throw new Error(`bio must be at most ${BIO_MAX} characters`);
  }
  return trimmed;
}
