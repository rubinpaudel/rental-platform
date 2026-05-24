import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  defaultsForStep,
  phoneStepSchema,
} from '@rental-platform/profile-schema';
import { FieldError, Input, Label, TextField } from 'heroui-native';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

export function PhoneStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit } = useWizardStep({
    step: 'phone',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('phone', profile) as { phone: string })
      : { phone: '' }),
    validators: { onSubmit: phoneStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('phone', profile);
  const copy = STEP_COPY.phone;

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
      <form.Field name="phone">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;
          return (
            <TextField isInvalid={!!error}>
              <Label>{t('profile.wizard.step.phone.field.phone')}</Label>
              <Input
                autoCapitalize="none"
                autoComplete="tel"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                placeholder="+32 4xx xx xx xx"
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
              />
              {error ? <FieldError>{error}</FieldError> : null}
            </TextField>
          );
        }}
      </form.Field>
    </WizardShell>
  );
}
