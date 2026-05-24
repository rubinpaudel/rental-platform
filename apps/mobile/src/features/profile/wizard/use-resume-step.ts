import { useEffect, useState } from 'react';
import {
  STEPS,
  isStepAnswered,
  isStepApplicable,
  type ProfileDto,
  type StepId,
} from '@rental-platform/profile-schema';
import { getSkippedSteps } from './skipped-store';

// Required-fields completeness gate. Used by the (app)/_layout
// redirect: when the user has any unanswered required step we route
// them into the wizard. Optional steps don't trigger this — they're
// answered later via section-edit from the overview.

export function hasUnansweredRequired(profile: ProfileDto): boolean {
  for (const step of STEPS) {
    if (!step.required) continue;
    if (!isStepApplicable(step, profile)) continue;
    if (!isStepAnswered(step, profile)) return true;
  }
  return false;
}

// Where the wizard should *land* given the profile state. Ordered scan:
//   1. First applicable, required step with a null answer → start there.
//   2. Else: first applicable, optional step the user hasn't already
//      tapped "Skip" on → ask once.
//   3. Else: every applicable step is either answered or deliberately
//      skipped → wizard is done; route caller to the overview.
//
// The "applicable" check drops conditional steps (today: employer hides
// for unemployed/student/retired) so we never strand the user on a
// question that doesn't apply to them.

export function nextWizardStep(
  profile: ProfileDto,
  skipped: ReadonlySet<StepId>,
): StepId | null {
  // First required, unanswered step.
  for (const step of STEPS) {
    if (!step.required) continue;
    if (!isStepApplicable(step, profile)) continue;
    if (!isStepAnswered(step, profile)) return step.id;
  }
  // Then any optional step the user hasn't skipped yet.
  for (const step of STEPS) {
    if (step.required) continue;
    if (!isStepApplicable(step, profile)) continue;
    if (isStepAnswered(step, profile)) continue;
    if (skipped.has(step.id)) continue;
    return step.id;
  }
  return null;
}

/**
 * The step that follows `current` once the user finishes it. Re-uses
 * `nextWizardStep` so resume and forward navigation agree on the next
 * cursor — answering a question changes the profile, which moves the
 * scan past it on the next pass.
 */
export function stepAfter(
  current: StepId,
  profile: ProfileDto,
  skipped: ReadonlySet<StepId>,
): StepId | null {
  const next = nextWizardStep(profile, skipped);
  // Defensive: if the patch hasn't landed in `profile` yet (caller
  // forgot to await), prevent an infinite loop on the same step.
  if (next === current) {
    const idx = STEPS.findIndex((s) => s.id === current);
    for (let i = idx + 1; i < STEPS.length; i++) {
      const step = STEPS[i]!;
      if (!isStepApplicable(step, profile)) continue;
      return step.id;
    }
    return null;
  }
  return next;
}

/**
 * Reactive variant: computes `nextWizardStep` from the current profile
 * + the persisted skipped-set. Returns `loading` until the skipped-set
 * has been read from SecureStore; the wizard route guard uses that to
 * delay any redirect until both sources are known.
 */
export function useResumeStep(profile: ProfileDto | null): {
  resumeStep: StepId | null;
  loading: boolean;
} {
  const [skipped, setSkipped] = useState<ReadonlySet<StepId> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void getSkippedSteps().then((s) => {
      if (!cancelled) setSkipped(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!profile || !skipped) return { resumeStep: null, loading: true };
  return { resumeStep: nextWizardStep(profile, skipped), loading: false };
}
