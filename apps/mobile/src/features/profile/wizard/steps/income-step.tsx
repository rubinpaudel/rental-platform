import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  defaultsForStep,
  incomeStepSchema,
} from '@rental-platform/profile-schema';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import { CurrencyField } from '../fields/currency-field';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

export function IncomeStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit } = useWizardStep({
    step: 'income',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('income', profile) as { monthlyNetIncomeCents: number })
      : { monthlyNetIncomeCents: 0 }),
    validators: { onSubmit: incomeStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('income', profile);
  const copy = STEP_COPY.income;

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
      <form.Field name="monthlyNetIncomeCents">
        {(field) => (
          <CurrencyField
            valueCents={field.state.value}
            onChangeCents={field.handleChange}
            label={t('profile.wizard.step.income.field')}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>
    </WizardShell>
  );
}
