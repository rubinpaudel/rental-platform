import { View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  defaultsForStep,
  employerStepSchema,
} from '@rental-platform/profile-schema';
import { FieldError, Input, Label, TextField } from 'heroui-native';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

type EmployerValue = { employer: string; monthsAtEmployer?: number };

export function EmployerStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit, skip } = useWizardStep({
    step: 'employer',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('employer', profile) as EmployerValue)
      : { employer: '', monthsAtEmployer: 0 }),
    validators: { onSubmit: employerStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('employer', profile);
  const copy = STEP_COPY.employer;

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
      <View className="gap-4">
        <form.Field name="employer">
          {(field) => {
            const error = field.state.meta.errors[0]?.message;
            return (
              <TextField isInvalid={!!error}>
                <Label>{t('profile.wizard.step.employer.field.employer')}</Label>
                <Input
                  autoCapitalize="words"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                />
                {error ? <FieldError>{error}</FieldError> : null}
              </TextField>
            );
          }}
        </form.Field>
        <form.Field name="monthsAtEmployer">
          {(field) => {
            const error = field.state.meta.errors[0]?.message;
            return (
              <TextField isInvalid={!!error}>
                <Label>{t('profile.wizard.step.employer.field.months')}</Label>
                <Input
                  keyboardType="number-pad"
                  inputMode="numeric"
                  value={field.state.value != null ? String(field.state.value) : ''}
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
      </View>
    </WizardShell>
  );
}
