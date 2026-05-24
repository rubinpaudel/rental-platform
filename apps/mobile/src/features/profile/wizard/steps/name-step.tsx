import { View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  defaultsForStep,
  nameStepSchema,
} from '@rental-platform/profile-schema';
import { FieldError, Input, Label, TextField } from 'heroui-native';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

export function NameStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit } = useWizardStep({
    step: 'name',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('name', profile) as { firstName: string; lastName: string })
      : { firstName: '', lastName: '' }),
    validators: { onSubmit: nameStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('name', profile);
  const copy = STEP_COPY.name;

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
      <View className="gap-4">
        <form.Field name="firstName">
          {(field) => {
            const error = field.state.meta.errors[0]?.message;
            return (
              <TextField isInvalid={!!error}>
                <Label>{t('profile.wizard.step.name.field.firstName')}</Label>
                <Input
                  autoCapitalize="words"
                  textContentType="givenName"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                />
                {error ? <FieldError>{error}</FieldError> : null}
              </TextField>
            );
          }}
        </form.Field>
        <form.Field name="lastName">
          {(field) => {
            const error = field.state.meta.errors[0]?.message;
            return (
              <TextField isInvalid={!!error}>
                <Label>{t('profile.wizard.step.name.field.lastName')}</Label>
                <Input
                  autoCapitalize="words"
                  textContentType="familyName"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
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
