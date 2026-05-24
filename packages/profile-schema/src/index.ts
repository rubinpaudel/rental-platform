// Public surface of @rental-platform/profile-schema.
//
// API consumers: `profilePatchSchema`, `ProfilePatch` (wire validation).
// Mobile consumers: `STEPS`, `STEP_IDS`, `stepInputSchemas`, `stepToPatch`,
//   `skipPatch`, `defaultsForStep`, `isStepAnswered`, `isStepApplicable`
//   (wizard rendering + resume logic).
// Shared types: `ProfileDto` (GET response), `EmploymentStatus`,
//   `IncomeProofType`, `ProfileSection`, `StepId`, `StepDef`.

export {
  EMPLOYMENT_STATUSES,
  INCOME_PROOF_TYPES,
  EMPLOYMENT_STATUSES_WITH_EMPLOYER,
  statusAllowsEmployer,
  type EmploymentStatus,
  type IncomeProofType,
} from './enums';

export {
  profilePatchSchema,
  type ProfilePatch,
  type IdentityPatch,
  type HouseholdPatch,
  type EmploymentPatch,
  type FinancialPatch,
  type MovePatch,
} from './patch.schema';

export type {
  ProfileDto,
  IdentitySection,
  HouseholdSection,
  EmploymentSection,
  FinancialSection,
  MoveSection,
} from './dto.types';

export {
  PROFILE_SECTIONS,
  STEP_IDS,
  STEPS,
  STEPS_BY_ID,
  stepInputSchemas,
  nameStepSchema,
  dateOfBirthStepSchema,
  phoneStepSchema,
  nationalityStepSchema,
  householdSizeStepSchema,
  petsStepSchema,
  employmentStatusStepSchema,
  employerStepSchema,
  incomeStepSchema,
  incomeProofStepSchema,
  guaranteeStepSchema,
  moveDateStepSchema,
  domicileStepSchema,
  bioStepSchema,
  isStepApplicable,
  isStepAnswered,
  stepToPatch,
  skipPatch,
  defaultsForStep,
  type ProfileSection,
  type StepId,
  type StepDef,
  type StepInputSchemas,
  type StepInput,
} from './steps';
