import type { TranslationKey } from '@rental-platform/i18n';
import {
  STEPS,
  STEPS_BY_ID,
  isStepApplicable,
  type ProfileDto,
  type ProfileSection,
  type StepId,
} from '@rental-platform/profile-schema';

// Translation-key map for each wizard step. Keeps step screens free of
// hard-coded copy keys — they just ask `stepCopyFor(id)` and render.
//
// Title and description keys follow the convention
//   profile.wizard.step.<id>.title
//   profile.wizard.step.<id>.description
// which is also how `packages/i18n/src/locales/nl.ts` orders them. If
// you add a step, add both keys to the i18n table and one entry below.

export interface StepCopy {
  title: TranslationKey;
  description: TranslationKey;
}

export const STEP_COPY: Readonly<Record<StepId, StepCopy>> = {
  name: {
    title: 'profile.wizard.step.name.title',
    description: 'profile.wizard.step.name.description',
  },
  'date-of-birth': {
    title: 'profile.wizard.step.date-of-birth.title',
    description: 'profile.wizard.step.date-of-birth.description',
  },
  phone: {
    title: 'profile.wizard.step.phone.title',
    description: 'profile.wizard.step.phone.description',
  },
  nationality: {
    title: 'profile.wizard.step.nationality.title',
    description: 'profile.wizard.step.nationality.description',
  },
  'household-size': {
    title: 'profile.wizard.step.household-size.title',
    description: 'profile.wizard.step.household-size.description',
  },
  pets: {
    title: 'profile.wizard.step.pets.title',
    description: 'profile.wizard.step.pets.description',
  },
  'employment-status': {
    title: 'profile.wizard.step.employment-status.title',
    description: 'profile.wizard.step.employment-status.description',
  },
  employer: {
    title: 'profile.wizard.step.employer.title',
    description: 'profile.wizard.step.employer.description',
  },
  income: {
    title: 'profile.wizard.step.income.title',
    description: 'profile.wizard.step.income.description',
  },
  'income-proof': {
    title: 'profile.wizard.step.income-proof.title',
    description: 'profile.wizard.step.income-proof.description',
  },
  guarantee: {
    title: 'profile.wizard.step.guarantee.title',
    description: 'profile.wizard.step.guarantee.description',
  },
  'move-date': {
    title: 'profile.wizard.step.move-date.title',
    description: 'profile.wizard.step.move-date.description',
  },
  domicile: {
    title: 'profile.wizard.step.domicile.title',
    description: 'profile.wizard.step.domicile.description',
  },
  bio: {
    title: 'profile.wizard.step.bio.title',
    description: 'profile.wizard.step.bio.description',
  },
};

/**
 * 1-based index of this step inside the *applicable* sequence — the
 * value to feed the progress bar. Hidden conditional steps (e.g.
 * `employer` for an unemployed user) don't count toward the total.
 */
export function applicableStepIndex(
  step: StepId,
  profile: ProfileDto,
): { index: number; total: number } {
  const applicable = STEPS.filter((s) => isStepApplicable(s, profile));
  const idx = applicable.findIndex((s) => s.id === step);
  return {
    index: idx === -1 ? 1 : idx + 1,
    total: applicable.length || STEPS.length,
  };
}

/**
 * Returns the section the step belongs to — convenience re-export so
 * screens can render section headings without importing the schema
 * package twice.
 */
export function sectionOf(step: StepId): ProfileSection {
  return STEPS_BY_ID[step].section;
}
