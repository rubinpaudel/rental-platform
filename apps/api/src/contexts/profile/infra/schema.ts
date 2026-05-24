import { pgTable, text, integer, boolean, timestamp, date, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * One row per tenant (`user_id` is the natural key). Fields are normalised
 * columns — not JSONB — so downstream contexts (Discovery filter v7,
 * Application inbox v9) can filter / sort on them directly.
 *
 * Internal `id` UUID exists only for joins; external API uses `user_id`.
 */
export const profiles = pgTable(
  'profiles',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().unique(),

    // Identity
    firstName: text('first_name'),
    lastName: text('last_name'),
    dateOfBirth: date('date_of_birth'),
    phone: text('phone'),
    nationality: text('nationality'),

    // Household
    householdSize: integer('household_size'),
    hasPets: boolean('has_pets'),
    petDescription: text('pet_description'),

    // Employment
    employmentStatus: text('employment_status'),
    employer: text('employer'),
    monthsAtEmployer: integer('months_at_employer'),

    // Financial (cents — see ADR for money handling)
    monthlyNetIncomeCents: integer('monthly_net_income_cents'),
    incomeProofType: text('income_proof_type'),
    guaranteeCapacityCents: integer('guarantee_capacity_cents'),

    // Move
    desiredMoveInDate: date('desired_move_in_date'),
    willingToDomicile: boolean('willing_to_domicile'),

    // Bio
    bio: text('bio').notNull().default(''),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('profiles_user_id_idx').on(table.userId),
    check(
      'profiles_employment_status_chk',
      sql`${table.employmentStatus} IS NULL OR ${table.employmentStatus} IN ('employed_indef','employed_fixed','self_employed','student','unemployed','retired')`,
    ),
    check(
      'profiles_income_proof_type_chk',
      sql`${table.incomeProofType} IS NULL OR ${table.incomeProofType} IN ('payslips','tax_assessment','accountant_statement','other')`,
    ),
    check(
      'profiles_household_size_chk',
      sql`${table.householdSize} IS NULL OR (${table.householdSize} >= 1 AND ${table.householdSize} <= 20)`,
    ),
    check(
      'profiles_monthly_net_income_chk',
      sql`${table.monthlyNetIncomeCents} IS NULL OR ${table.monthlyNetIncomeCents} >= 0`,
    ),
    check(
      'profiles_guarantee_capacity_chk',
      sql`${table.guaranteeCapacityCents} IS NULL OR ${table.guaranteeCapacityCents} >= 0`,
    ),
    check(
      'profiles_months_at_employer_chk',
      sql`${table.monthsAtEmployer} IS NULL OR (${table.monthsAtEmployer} >= 0 AND ${table.monthsAtEmployer} <= 1200)`,
    ),
  ],
);
