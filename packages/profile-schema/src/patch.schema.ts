import { z } from 'zod';

// Wire contract for `PATCH /me/profile` (and `PUT` upsert). Every section
// and the top level are `.strict()` so clients can't silently smuggle
// unknown keys — misnamed fields surface as a 400 instead of vanishing.
//
// This schema is structural only (shape, primitive types, nullability).
// Semantic validation (enum membership, E.164 phone, ISO date round-trip,
// name length, …) stays in the server-side value objects — the domain
// owns its own invariants and emits messages tuned to the field. The
// mobile wizard adds friendlier per-step validators on top (see
// `./steps`) for inline form errors, including enum membership.

const identityPatch = z
  .object({
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    dateOfBirth: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    nationality: z.string().nullable().optional(),
  })
  .strict();

const householdPatch = z
  .object({
    householdSize: z.number().int().nullable().optional(),
    hasPets: z.boolean().nullable().optional(),
    petDescription: z.string().nullable().optional(),
  })
  .strict();

const employmentPatch = z
  .object({
    // Status is `z.string()` not `z.enum(EMPLOYMENT_STATUSES)` so the
    // wire contract stays permissive — invalid enum values flow through
    // to the domain VO which throws with a field-aware message. The step
    // validators in `./steps` enforce membership at the wizard layer.
    status: z.string().nullable().optional(),
    employer: z.string().nullable().optional(),
    monthsAtEmployer: z.number().int().nullable().optional(),
  })
  .strict();

const financialPatch = z
  .object({
    monthlyNetIncomeCents: z.number().int().nullable().optional(),
    incomeProofType: z.string().nullable().optional(),
    guaranteeCapacityCents: z.number().int().nullable().optional(),
  })
  .strict();

const movePatch = z
  .object({
    desiredMoveInDate: z.string().nullable().optional(),
    willingToDomicile: z.boolean().nullable().optional(),
  })
  .strict();

export const profilePatchSchema = z
  .object({
    identity: identityPatch.optional(),
    household: householdPatch.optional(),
    employment: employmentPatch.optional(),
    financial: financialPatch.optional(),
    move: movePatch.optional(),
    bio: z.string().nullable().optional(),
  })
  .strict();

export type ProfilePatch = z.infer<typeof profilePatchSchema>;
export type IdentityPatch = z.infer<typeof identityPatch>;
export type HouseholdPatch = z.infer<typeof householdPatch>;
export type EmploymentPatch = z.infer<typeof employmentPatch>;
export type FinancialPatch = z.infer<typeof financialPatch>;
export type MovePatch = z.infer<typeof movePatch>;
