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

export interface ProfileProps {
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

export interface ProfilePatch {
  identity?: IdentityInput;
  household?: HouseholdInput;
  employment?: EmploymentInput;
  financial?: FinancialInput;
  move?: MoveIntentInput;
  bio?: string | null;
}

export class Profile {
  readonly userId: UserId;
  identity: Identity;
  household: Household;
  employment: Employment;
  financial: Financial;
  move: MoveIntent;
  bio: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: ProfileProps) {
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

  static empty(userId: UserId, now: Date = new Date()): Profile {
    return new Profile({
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

  patch(input: ProfilePatch): void {
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

  replace(input: ProfilePatch): void {
    this.identity = identity(input.identity ?? {});
    this.household = household(input.household ?? {});
    this.employment = employment(input.employment ?? {});
    this.financial = financial(input.financial ?? {});
    this.move = moveIntent(input.move ?? {});
    this.bio = normaliseBio(input.bio ?? '');
    this.updatedAt = new Date();
  }

}

function normaliseBio(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length > BIO_MAX) {
    throw new Error(`bio must be at most ${BIO_MAX} characters`);
  }
  return trimmed;
}
