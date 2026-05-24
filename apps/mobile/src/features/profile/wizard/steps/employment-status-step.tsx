import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  defaultsForStep,
  EMPLOYMENT_STATUSES,
  employmentStatusStepSchema,
  type EmploymentStatus,
} from '@rental-platform/profile-schema';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import { SegmentedRadioField } from '../fields/segmented-radio-field';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

const STATUS_OPTIONS = EMPLOYMENT_STATUSES.map((status) => ({
  value: status,
  label: t(`profile.wizard.step.employment-status.option.${status}`),
}));

export function EmploymentStatusStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit } = useWizardStep({
    step: 'employment-status',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('employment-status', profile) as { status: EmploymentStatus | '' })
      : { status: '' }),
    validators: { onSubmit: employmentStatusStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('employment-status', profile);
  const copy = STEP_COPY['employment-status'];

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
      <form.Field name="status">
        {(field) => (
          <SegmentedRadioField
            value={field.state.value}
            onChange={field.handleChange}
            options={STATUS_OPTIONS}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>
    </WizardShell>
  );
}
