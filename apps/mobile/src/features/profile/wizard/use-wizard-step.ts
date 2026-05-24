import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  skipPatch,
  stepToPatch,
  type ProfileDto,
  type StepId,
} from '@rental-platform/profile-schema';
import { useProfile } from '../profile-context';
import { ProfileApiError } from '@/lib/api/profile';
import {
  getSkippedSteps,
  markStepSkipped,
  unmarkStepSkipped,
} from './skipped-store';
import { stepAfter } from './use-resume-step';

// Single hook every wizard step screen mounts. Owns:
//   - submitting the step's value via `stepToPatch` + applyPatch
//   - submitting a "Skip" via `skipPatch` + applyPatch + persisting the
//     skipped marker so resume doesn't bounce back to this step
//   - navigating to the next step (or out to the overview when done)
//   - surfacing a friendly server error string
//
// Keeps individual step components a thin render layer over the form.

interface UseWizardStepOptions {
  step: StepId;
  /**
   * "wizard" advances forward through `stepAfter`. "edit" hops back to
   * the overview after a successful save (or skip).
   */
  mode: 'wizard' | 'edit';
}

interface UseWizardStepReturn {
  /** Latest cached profile; null while the initial fetch is in flight. */
  profile: ProfileDto | null;
  /** Local set of optional steps the user has tapped "Sla over" on. */
  skipped: ReadonlySet<StepId>;
  /** Server-side error from the last PATCH attempt, ready to render. */
  serverError: string | null;
  isSubmitting: boolean;
  /** Submit happy path — call from the form's onSubmit. */
  submit: (value: Record<string, unknown>) => Promise<void>;
  /** Skip path — wired to the secondary CTA on optional steps. */
  skip: () => Promise<void>;
}

export function useWizardStep({
  step,
  mode,
}: UseWizardStepOptions): UseWizardStepReturn {
  const { profile, applyPatch } = useProfile();
  const router = useRouter();

  const [skipped, setSkipped] = useState<ReadonlySet<StepId>>(new Set());
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void getSkippedSteps().then(setSkipped);
  }, []);

  const advance = useCallback(
    (updated: ProfileDto, freshSkipped: ReadonlySet<StepId>) => {
      if (mode === 'edit') {
        // Section-edit reuses the same screen — pop back to overview.
        if (router.canGoBack()) router.back();
        else router.replace('/profile');
        return;
      }
      const next = stepAfter(step, updated, freshSkipped);
      if (next) {
        router.replace(`/profile/wizard/${next}` as never);
      } else {
        // Wizard reached the end — go to the overview (lands in PR 4).
        router.replace('/profile');
      }
    },
    [mode, router, step],
  );

  const submit = useCallback(
    async (value: Record<string, unknown>) => {
      setServerError(null);
      setIsSubmitting(true);
      try {
        const updated = await applyPatch(stepToPatch(step, value));
        // Answering a previously-skipped step clears the skip marker.
        await unmarkStepSkipped(step);
        const next = new Set(skipped);
        next.delete(step);
        setSkipped(next);
        advance(updated, next);
      } catch (err) {
        setServerError(
          err instanceof ProfileApiError
            ? err.friendly
            : 'Er ging iets mis. Probeer het opnieuw.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [applyPatch, step, advance, skipped],
  );

  const skip = useCallback(async () => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const updated = await applyPatch(skipPatch(step));
      await markStepSkipped(step);
      const next = new Set(skipped);
      next.add(step);
      setSkipped(next);
      advance(updated, next);
    } catch (err) {
      setServerError(
        err instanceof ProfileApiError
          ? err.friendly
          : 'Er ging iets mis. Probeer het opnieuw.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [applyPatch, step, advance, skipped]);

  return { profile, skipped, serverError, isSubmitting, submit, skip };
}
