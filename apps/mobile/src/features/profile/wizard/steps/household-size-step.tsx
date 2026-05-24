import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  defaultsForStep,
  householdSizeStepSchema,
} from '@rental-platform/profile-schema';
import { FieldError, Input, Label, TextField } from 'heroui-native';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

export function HouseholdSizeStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit } = useWizardStep({
    step: 'household-size',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('household-size', profile) as { householdSize: number })
      : { householdSize: 1 }),
    validators: { onSubmit: householdSizeStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('household-size', profile);
  const copy = STEP_COPY['household-size'];

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
      <form.Field name="householdSize">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;
          return (
            <TextField isInvalid={!!error}>
              <Label>{t('profile.wizard.step.household-size.field')}</Label>
              <Input
                keyboardType="number-pad"
                inputMode="numeric"
                value={String(field.state.value)}
                onChangeText={(v) => {
                  const n = Number.parseInt(v.replace(/\D/g, ''), 10);
                  field.handleChange(Number.isFinite(n) ? n : 0);
                }}
              />
              {error ? <FieldError>{error}</FieldError> : null}
            </TextField>
          );
        }}
      </form.Field>
    </WizardShell>
  );
}
