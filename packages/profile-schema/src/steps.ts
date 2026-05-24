import { z } from 'zod';
import { EMPLOYMENT_STATUSES, INCOME_PROOF_TYPES, statusAllowsEmployer } from './enums';
import type { ProfileDto } from './dto.types';
import type { ProfilePatch } from './patch.schema';

// ── Sections ───────────────────────────────────────────────────────────
// Six top-level sections the overview shows as cards. The wizard groups
// fine-grained step screens under these sections so editing later from
// the overview re-uses the same step components.

export const PROFILE_SECTIONS = [
  'identity',
  'household',
  'employment',
  'financial',
  'move',
  'about',
] as const;
export type ProfileSection = (typeof PROFILE_SECTIONS)[number];

// ── Step ids ───────────────────────────────────────────────────────────
// Each step asks ONE focused question (one or two related fields). This
// is the conversational granularity — the spec lists six "steps" but the
// product brief calls for one-question-per-screen, so each section is
// split into 1–4 sub-steps. Step ids are used directly as the wizard
// route param (`/profile/wizard/[step]`).

export const STEP_IDS = [
  'name',
  'date-of-birth',
  'phone',
  'nationality',
  'household-size',
  'pets',
  'employment-status',
  'employer',
  'income',
  'income-proof',
  'guarantee',
  'move-date',
  'domicile',
  'bio',
] as const;
export type StepId = (typeof STEP_IDS)[number];

// ── Per-step answer shapes ─────────────────────────────────────────────
// Zod schemas the wizard uses to validate one screen's worth of input
// BEFORE PATCHing the server. Friendlier than the raw patch schema (which
// allows nulls everywhere because PATCH is partial) — these enforce that
// the user actually answered the question on this screen.
//
// Messages are Dutch (the source-of-truth locale per @rental-platform/i18n).
// Wrapped in a re-translated form if/when we add fr/en, but inlining today
// keeps the wizard render path string-table-free.

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_COUNTRY_RE = /^[A-Z]{2}$/;

export const nameStepSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'Vul je voornaam in' })
    .max(100, { message: 'Maximaal 100 tekens' }),
  lastName: z
    .string()
    .trim()
    .min(1, { message: 'Vul je achternaam in' })
    .max(100, { message: 'Maximaal 100 tekens' }),
});

export const dateOfBirthStepSchema = z.object({
  dateOfBirth: z
    .string()
    .regex(ISO_DATE_RE, { message: 'Kies een geldige geboortedatum' }),
});

export const phoneStepSchema = z.object({
  // Server does the heavy BE-format validation via libphonenumber-js. We
  // only enforce non-empty + a few digits client-side so users get instant
  // feedback for the obvious mistake (empty field).
  phone: z
    .string()
    .trim()
    .min(8, { message: 'Vul een geldig telefoonnummer in' }),
});

export const nationalityStepSchema = z.object({
  nationality: z
    .string()
    .regex(ISO_COUNTRY_RE, { message: 'Kies een nationaliteit' }),
});

export const householdSizeStepSchema = z.object({
  householdSize: z
    .number({ message: 'Vul het aantal personen in' })
    .int()
    .min(1, { message: 'Minimaal 1 persoon' })
    .max(20, { message: 'Maximaal 20 personen' }),
});

// Pets is intrinsically two-shaped: a boolean answer, and (only when
// "yes") a short free-text description. `superRefine` enforces that.
export const petsStepSchema = z
  .object({
    hasPets: z.boolean({ message: 'Maak een keuze' }),
    petDescription: z
      .string()
      .trim()
      .max(500, { message: 'Maximaal 500 tekens' })
      .optional(),
  })
  .superRefine((value, ctx) => {
    if (value.hasPets === false && value.petDescription) {
      ctx.addIssue({
        code: 'custom',
        path: ['petDescription'],
        message: 'Beschrijving alleen invullen als je huisdieren hebt',
      });
    }
  });

export const employmentStatusStepSchema = z.object({
  status: z.enum(EMPLOYMENT_STATUSES, { message: 'Maak een keuze' }),
});

export const employerStepSchema = z.object({
  employer: z
    .string()
    .trim()
    .min(1, { message: 'Vul de naam van je werkgever in' })
    .max(200, { message: 'Maximaal 200 tekens' }),
  monthsAtEmployer: z
    .number()
    .int()
    .min(0, { message: 'Niet-negatief getal' })
    .max(1200, { message: 'Onrealistisch lang' })
    .optional(),
});

export const incomeStepSchema = z.object({
  monthlyNetIncomeCents: z
    .number({ message: 'Vul je netto maandinkomen in' })
    .int()
    .min(0, { message: 'Niet-negatief bedrag' }),
});

export const incomeProofStepSchema = z.object({
  incomeProofType: z.enum(INCOME_PROOF_TYPES, { message: 'Maak een keuze' }),
});

export const guaranteeStepSchema = z.object({
  guaranteeCapacityCents: z
    .number({ message: 'Vul je waarborg-capaciteit in' })
    .int()
    .min(0, { message: 'Niet-negatief bedrag' }),
});

export const moveDateStepSchema = z.object({
  desiredMoveInDate: z
    .string()
    .regex(ISO_DATE_RE, { message: 'Kies een datum' }),
});

export const domicileStepSchema = z.object({
  willingToDomicile: z.boolean({ message: 'Maak een keuze' }),
});

export const bioStepSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(1000, { message: 'Maximaal 1000 tekens' }),
});

// Discriminated union of all step input shapes, keyed by step id. Used in
// `stepToPatch` and as the source of truth for `StepInput<StepId>`.
export const stepInputSchemas = {
  name: nameStepSchema,
  'date-of-birth': dateOfBirthStepSchema,
  phone: phoneStepSchema,
  nationality: nationalityStepSchema,
  'household-size': householdSizeStepSchema,
  pets: petsStepSchema,
  'employment-status': employmentStatusStepSchema,
  employer: employerStepSchema,
  income: incomeStepSchema,
  'income-proof': incomeProofStepSchema,
  guarantee: guaranteeStepSchema,
  'move-date': moveDateStepSchema,
  domicile: domicileStepSchema,
  bio: bioStepSchema,
} as const satisfies Record<StepId, z.ZodTypeAny>;

export type StepInputSchemas = typeof stepInputSchemas;
export type StepInput<S extends StepId> = z.infer<StepInputSchemas[S]>;

// ── Step definitions ───────────────────────────────────────────────────
// Each step carries enough metadata for the wizard to render, validate,
// and resume without the UI having to hard-code field maps.

export interface StepDef {
  readonly id: StepId;
  readonly section: ProfileSection;
  /**
   * Required steps must be answered before the wizard considers itself
   * "complete" — no Skip affordance. Optional steps render a Skip CTA
   * alongside the primary Continue.
   */
  readonly required: boolean;
}

export const STEPS: readonly StepDef[] = [
  { id: 'name', section: 'identity', required: true },
  { id: 'date-of-birth', section: 'identity', required: true },
  { id: 'phone', section: 'identity', required: true },
  { id: 'nationality', section: 'identity', required: false },
  { id: 'household-size', section: 'household', required: true },
  { id: 'pets', section: 'household', required: false },
  { id: 'employment-status', section: 'employment', required: true },
  { id: 'employer', section: 'employment', required: false },
  { id: 'income', section: 'financial', required: true },
  { id: 'income-proof', section: 'financial', required: false },
  { id: 'guarantee', section: 'financial', required: true },
  { id: 'move-date', section: 'move', required: false },
  { id: 'domicile', section: 'move', required: false },
  { id: 'bio', section: 'about', required: false },
];

export const STEPS_BY_ID: Readonly<Record<StepId, StepDef>> = Object.freeze(
  Object.fromEntries(STEPS.map((s) => [s.id, s])) as Record<StepId, StepDef>,
);

// ── Conditional step visibility ────────────────────────────────────────
// Some steps don't apply to every user. Today the only conditional is
// `employer` (only sensible for employed_indef / employed_fixed /
// self_employed). The resume logic skips invisible steps automatically.

export function isStepApplicable(
  step: StepDef,
  profile: ProfileDto,
): boolean {
  if (step.id === 'employer') {
    return statusAllowsEmployer(profile.employment.status);
  }
  return true;
}

// ── Step "answered" predicate ──────────────────────────────────────────
// A step is "answered" iff its primary field(s) have a non-null value on
// the profile DTO. Pets is special: the boolean `hasPets` being non-null
// counts — the optional `petDescription` doesn't gate the step.

export function isStepAnswered(step: StepDef, profile: ProfileDto): boolean {
  switch (step.id) {
    case 'name':
      return (
        profile.identity.firstName != null && profile.identity.lastName != null
      );
    case 'date-of-birth':
      return profile.identity.dateOfBirth != null;
    case 'phone':
      return profile.identity.phone != null;
    case 'nationality':
      return profile.identity.nationality != null;
    case 'household-size':
      return profile.household.householdSize != null;
    case 'pets':
      return profile.household.hasPets != null;
    case 'employment-status':
      return profile.employment.status != null;
    case 'employer':
      return profile.employment.employer != null;
    case 'income':
      return profile.financial.monthlyNetIncomeCents != null;
    case 'income-proof':
      return profile.financial.incomeProofType != null;
    case 'guarantee':
      return profile.financial.guaranteeCapacityCents != null;
    case 'move-date':
      return profile.move.desiredMoveInDate != null;
    case 'domicile':
      return profile.move.willingToDomicile != null;
    case 'bio':
      return profile.bio.trim().length > 0;
  }
}

// ── Step → patch translator ────────────────────────────────────────────
// Converts a step's validated answer into a `ProfilePatch` suitable for
// the wire. Each step touches exactly one section (or `bio`) so patches
// stay minimal — only the changed section is sent.
//
// `skipPatch(step)` builds the equivalent "I'm skipping this" patch:
// nulls for the fields this step owns. Wired to the Skip CTA so the
// server records a deliberate null rather than the user disappearing.

export function stepToPatch(
  step: StepId,
  value: Record<string, unknown>,
): ProfilePatch {
  switch (step) {
    case 'name':
      return {
        identity: {
          firstName: value.firstName as string,
          lastName: value.lastName as string,
        },
      };
    case 'date-of-birth':
      return { identity: { dateOfBirth: value.dateOfBirth as string } };
    case 'phone':
      return { identity: { phone: value.phone as string } };
    case 'nationality':
      return { identity: { nationality: value.nationality as string } };
    case 'household-size':
      return { household: { householdSize: value.householdSize as number } };
    case 'pets':
      return {
        household: {
          hasPets: value.hasPets as boolean,
          petDescription: ((value.petDescription as string | undefined) ?? null) || null,
        },
      };
    case 'employment-status':
      return { employment: { status: value.status as typeof EMPLOYMENT_STATUSES[number] } };
    case 'employer':
      return {
        employment: {
          employer: value.employer as string,
          monthsAtEmployer: (value.monthsAtEmployer as number | undefined) ?? null,
        },
      };
    case 'income':
      return {
        financial: {
          monthlyNetIncomeCents: value.monthlyNetIncomeCents as number,
        },
      };
    case 'income-proof':
      return {
        financial: {
          incomeProofType: value.incomeProofType as typeof INCOME_PROOF_TYPES[number],
        },
      };
    case 'guarantee':
      return {
        financial: {
          guaranteeCapacityCents: value.guaranteeCapacityCents as number,
        },
      };
    case 'move-date':
      return { move: { desiredMoveInDate: value.desiredMoveInDate as string } };
    case 'domicile':
      return { move: { willingToDomicile: value.willingToDomicile as boolean } };
    case 'bio':
      return { bio: value.bio as string };
  }
}

export function skipPatch(step: StepId): ProfilePatch {
  switch (step) {
    case 'name':
      return { identity: { firstName: null, lastName: null } };
    case 'date-of-birth':
      return { identity: { dateOfBirth: null } };
    case 'phone':
      return { identity: { phone: null } };
    case 'nationality':
      return { identity: { nationality: null } };
    case 'household-size':
      return { household: { householdSize: null } };
    case 'pets':
      return { household: { hasPets: null, petDescription: null } };
    case 'employment-status':
      return { employment: { status: null } };
    case 'employer':
      return { employment: { employer: null, monthsAtEmployer: null } };
    case 'income':
      return { financial: { monthlyNetIncomeCents: null } };
    case 'income-proof':
      return { financial: { incomeProofType: null } };
    case 'guarantee':
      return { financial: { guaranteeCapacityCents: null } };
    case 'move-date':
      return { move: { desiredMoveInDate: null } };
    case 'domicile':
      return { move: { willingToDomicile: null } };
    case 'bio':
      return { bio: null };
  }
}

// ── Pre-fill helpers ───────────────────────────────────────────────────
// Build a step's `defaultValues` from a profile DTO so the wizard
// re-opens with existing answers populated. Empty/null fields fall back
// to RHF/TanStack-friendly defaults (empty string, zero, false).

export function defaultsForStep(
  step: StepId,
  profile: ProfileDto,
): Record<string, unknown> {
  switch (step) {
    case 'name':
      return {
        firstName: profile.identity.firstName ?? '',
        lastName: profile.identity.lastName ?? '',
      };
    case 'date-of-birth':
      return { dateOfBirth: profile.identity.dateOfBirth ?? '' };
    case 'phone':
      return { phone: profile.identity.phone ?? '' };
    case 'nationality':
      return { nationality: profile.identity.nationality ?? '' };
    case 'household-size':
      return { householdSize: profile.household.householdSize ?? 1 };
    case 'pets':
      return {
        hasPets: profile.household.hasPets ?? false,
        petDescription: profile.household.petDescription ?? '',
      };
    case 'employment-status':
      return { status: profile.employment.status ?? '' };
    case 'employer':
      return {
        employer: profile.employment.employer ?? '',
        monthsAtEmployer: profile.employment.monthsAtEmployer ?? 0,
      };
    case 'income':
      return { monthlyNetIncomeCents: profile.financial.monthlyNetIncomeCents ?? 0 };
    case 'income-proof':
      return { incomeProofType: profile.financial.incomeProofType ?? '' };
    case 'guarantee':
      return { guaranteeCapacityCents: profile.financial.guaranteeCapacityCents ?? 0 };
    case 'move-date':
      return { desiredMoveInDate: profile.move.desiredMoveInDate ?? '' };
    case 'domicile':
      return { willingToDomicile: profile.move.willingToDomicile ?? false };
    case 'bio':
      return { bio: profile.bio };
  }
}
