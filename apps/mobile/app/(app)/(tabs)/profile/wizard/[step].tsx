import { Redirect, useLocalSearchParams } from 'expo-router';
import { STEP_IDS, type StepId } from '@rental-platform/profile-schema';
import { renderStep } from '@/features/profile/wizard/step-router';

// Dynamic wizard step route. `step` comes from the URL; if it isn't a
// known StepId we bounce back to the resolver, which picks the right
// resume target. The "edit" mode is also routed through this file —
// section-edit links (PR 4) append `?edit=1`, suppressing the Skip
// button and switching the back button on.

export default function WizardStepScreen() {
  const { step, edit } = useLocalSearchParams<{
    step: string;
    edit?: string;
  }>();

  if (!isStepId(step)) {
    return <Redirect href="/profile/wizard" />;
  }

  return renderStep(step, { mode: edit ? 'edit' : 'wizard' });
}

function isStepId(value: unknown): value is StepId {
  return typeof value === 'string' && (STEP_IDS as readonly string[]).includes(value);
}
