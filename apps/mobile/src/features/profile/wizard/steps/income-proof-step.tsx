import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  defaultsForStep,
  INCOME_PROOF_TYPES,
  incomeProofStepSchema,
  type IncomeProofType,
} from '@rental-platform/profile-schema';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import { SegmentedRadioField } from '../fields/segmented-radio-field';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

const PROOF_OPTIONS = INCOME_PROOF_TYPES.map((value) => ({
  value,
  label: t(`profile.wizard.step.income-proof.option.${value}`),
}));

export function IncomeProofStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit, skip } = useWizardStep({
    step: 'income-proof',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('income-proof', profile) as { incomeProofType: IncomeProofType | '' })
      : { incomeProofType: '' }),
    validators: { onSubmit: incomeProofStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('income-proof', profile);
  const copy = STEP_COPY['income-proof'];

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
      <form.Field name="incomeProofType">
        {(field) => (
          <SegmentedRadioField
            value={field.state.value}
            onChange={field.handleChange}
            options={PROOF_OPTIONS}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>
    </WizardShell>
  );
}
