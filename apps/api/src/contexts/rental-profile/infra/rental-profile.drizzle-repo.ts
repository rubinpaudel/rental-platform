import { eq } from 'drizzle-orm';
import type { Database } from '@rental-platform/db';
import { rentalProfiles } from './schema';
import { RentalProfile } from '../domain/rental-profile.aggregate';
import { identity } from '../domain/identity.vo';
import { household } from '../domain/household.vo';
import { employment } from '../domain/employment.vo';
import { financial } from '../domain/financial.vo';
import { moveIntent } from '../domain/move-intent.vo';
import type { RentalProfileRepo } from '../domain/rental-profile.repo';
import { userId, type UserId } from '../../identity/domain/user-id.vo';

export class RentalProfileDrizzleRepo implements RentalProfileRepo {
  constructor(private readonly db: Database) {}

  async findByUser(id: UserId): Promise<RentalProfile | null> {
    const rows = await this.db
      .select()
      .from(rentalProfiles)
      .where(eq(rentalProfiles.userId, id))
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    return hydrate(row);
  }

  async upsert(profile: RentalProfile): Promise<void> {
    const existing = await this.db
      .select({ id: rentalProfiles.id })
      .from(rentalProfiles)
      .where(eq(rentalProfiles.userId, profile.userId))
      .limit(1);

    const row = {
      userId: profile.userId,
      firstName: profile.identity.firstName,
      lastName: profile.identity.lastName,
      dateOfBirth: profile.identity.dateOfBirth,
      phone: profile.identity.phone,
      nationality: profile.identity.nationality,
      householdSize: profile.household.householdSize,
      hasPets: profile.household.hasPets,
      petDescription: profile.household.petDescription,
      employmentStatus: profile.employment.status,
      employer: profile.employment.employer,
      monthsAtEmployer: profile.employment.monthsAtEmployer,
      monthlyNetIncomeCents: profile.financial.monthlyNetIncomeCents,
      incomeProofType: profile.financial.incomeProofType,
      guaranteeCapacityCents: profile.financial.guaranteeCapacityCents,
      desiredMoveInDate: profile.move.desiredMoveInDate,
      willingToDomicile: profile.move.willingToDomicile,
      bio: profile.bio,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };

    if (existing[0]) {
      await this.db
        .update(rentalProfiles)
        .set(row)
        .where(eq(rentalProfiles.id, existing[0].id));
    } else {
      await this.db.insert(rentalProfiles).values({ id: crypto.randomUUID(), ...row });
    }
  }
}

function hydrate(row: typeof rentalProfiles.$inferSelect): RentalProfile {
  return new RentalProfile({
    userId: userId(row.userId),
    identity: identity({
      firstName: row.firstName,
      lastName: row.lastName,
      dateOfBirth: row.dateOfBirth,
      phone: row.phone,
      nationality: row.nationality,
    }),
    household: household({
      householdSize: row.householdSize,
      hasPets: row.hasPets,
      petDescription: row.petDescription,
    }),
    employment: employment({
      status: row.employmentStatus,
      employer: row.employer,
      monthsAtEmployer: row.monthsAtEmployer,
    }),
    financial: financial({
      monthlyNetIncomeCents: row.monthlyNetIncomeCents,
      incomeProofType: row.incomeProofType,
      guaranteeCapacityCents: row.guaranteeCapacityCents,
    }),
    move: moveIntent({
      desiredMoveInDate: row.desiredMoveInDate,
      willingToDomicile: row.willingToDomicile,
    }),
    bio: row.bio,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}
