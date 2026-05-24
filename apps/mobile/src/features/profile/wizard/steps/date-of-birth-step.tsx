import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  dateOfBirthStepSchema,
  defaultsForStep,
} from '@rental-platform/profile-schema';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import { DateField } from '../fields/date-field';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

// 120 years back is the domain's MAX_AGE_YEARS bound — match it on the
// picker so users can't enter a date the server would reject.
const MAX_AGE_DATE = new Date();
MAX_AGE_DATE.setFullYear(MAX_AGE_DATE.getFullYear() - 120);

export function DateOfBirthStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit } = useWizardStep({
    step: 'date-of-birth',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('date-of-birth', profile) as { dateOfBirth: string })
      : { dateOfBirth: '' }),
    validators: { onSubmit: dateOfBirthStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('date-of-birth', profile);
  const copy = STEP_COPY['date-of-birth'];

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
    >
      <form.Field name="dateOfBirth">
        {(field) => (
          <DateField
            value={field.state.value}
            onChange={field.handleChange}
            label={t('profile.wizard.step.date-of-birth.title')}
            placeholder="dd/mm/jjjj"
            error={field.state.meta.errors[0]?.message}
            minimumDate={MAX_AGE_DATE}
            maximumDate={new Date()}
          />
        )}
      </form.Field>
    </WizardShell>
  );
}
