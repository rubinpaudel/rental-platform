import { z } from 'zod';

/**
 * Wire contract for tenant profile PATCH / PUT. Every section and the top
 * level are `.strict()` so clients can't silently smuggle unknown keys —
 * misnamed fields surface as a 400 instead of vanishing on the floor.
 *
 * This schema is structural only (shape, primitive types, nullability).
 * Semantic validation (E.164 phone, ISO date round-trip, name length, …)
 * stays in the value objects so the domain owns its own invariants.
 */

const identitySchema = z
  .object({
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    dateOfBirth: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    nationality: z.string().nullable().optional(),
  })
  .strict();

const householdSchema = z
  .object({
    householdSize: z.number().int().nullable().optional(),
    hasPets: z.boolean().nullable().optional(),
    petDescription: z.string().nullable().optional(),
  })
  .strict();

const employmentSchema = z
  .object({
    status: z.string().nullable().optional(),
    employer: z.string().nullable().optional(),
    monthsAtEmployer: z.number().int().nullable().optional(),
  })
  .strict();

const financialSchema = z
  .object({
    monthlyNetIncomeCents: z.number().int().nullable().optional(),
    incomeProofType: z.string().nullable().optional(),
    guaranteeCapacityCents: z.number().int().nullable().optional(),
  })
  .strict();

const moveSchema = z
  .object({
    desiredMoveInDate: z.string().nullable().optional(),
    willingToDomicile: z.boolean().nullable().optional(),
  })
  .strict();

export const profileInputSchema = z
  .object({
    identity: identitySchema.optional(),
    household: householdSchema.optional(),
    employment: employmentSchema.optional(),
    financial: financialSchema.optional(),
    move: moveSchema.optional(),
    bio: z.string().nullable().optional(),
  })
  .strict();

export type ProfileInput = z.infer<typeof profileInputSchema>;
