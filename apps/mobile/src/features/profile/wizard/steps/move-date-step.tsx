import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  defaultsForStep,
  moveDateStepSchema,
} from '@rental-platform/profile-schema';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import { DateField } from '../fields/date-field';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

// Sensible window: from tomorrow to two years out. Past dates don't
// help anyone; longer than two years suggests guessing.
const MIN_MOVE = new Date(Date.now() + 24 * 60 * 60 * 1000);
const MAX_MOVE = new Date();
MAX_MOVE.setFullYear(MAX_MOVE.getFullYear() + 2);

export function MoveDateStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit, skip } = useWizardStep({
    step: 'move-date',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('move-date', profile) as { desiredMoveInDate: string })
      : { desiredMoveInDate: '' }),
    validators: { onSubmit: moveDateStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('move-date', profile);
  const copy = STEP_COPY['move-date'];

  return (
    <WizardShell
      mode={mode}
      stepIndex={index}
      totalSteps={total}
      title={t(copy.title)}
      description={t(copy.description)}
      serverError={serverError}
      primary={{
        label: t(mode === 'edit' ? 'profile.wizard.cta.save' : 'profile.wizard.cta.continue'),
        onPress: () => void form.handleSubmit(),
        isLoading: isSubmitting,
      }}
      secondary={
        mode === 'wizard'
          ? { label: t('profile.wizard.cta.skip'), onPress: () => void skip() }
          : undefined
      }
    >
      <form.Field name="desiredMoveInDate">
        {(field) => (
          <DateField
            value={field.state.value}
            onChange={field.handleChange}
            label={t('profile.wizard.step.move-date.title')}
            placeholder="dd/mm/jjjj"
            error={field.state.meta.errors[0]?.message}
            minimumDate={MIN_MOVE}
            maximumDate={MAX_MOVE}
          />
        )}
      </form.Field>
    </WizardShell>
  );
}
