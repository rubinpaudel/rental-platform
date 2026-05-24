import { View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  bioStepSchema,
  defaultsForStep,
} from '@rental-platform/profile-schema';
import { FieldError, Label, TextArea } from 'heroui-native';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

export function BioStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit, skip } = useWizardStep({
    step: 'bio',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('bio', profile) as { bio: string })
      : { bio: '' }),
    validators: { onSubmit: bioStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('bio', profile);
  const copy = STEP_COPY.bio;

  return (
    <WizardShell
      mode={mode}
      stepIndex={index}
      totalSteps={total}
      title={t(copy.title)}
      description={t(copy.description)}
      serverError={serverError}
      primary={{
        label: t(mode === 'edit' ? 'profile.wizard.cta.save' : 'profile.wizard.cta.finish'),
        onPress: () => void form.handleSubmit(),
        isLoading: isSubmitting,
      }}
      secondary={
        mode === 'wizard'
          ? { label: t('profile.wizard.cta.skip'), onPress: () => void skip() }
          : undefined
      }
    >
      <form.Field name="bio">
        {(field) => {
          const error = field.state.meta.errors[0]?.message;
          return (
            <View className="gap-2">
              <Label>{t('profile.wizard.step.bio.field')}</Label>
              <TextArea
                isInvalid={!!error}
                placeholder={t('profile.wizard.step.bio.placeholder')}
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
              />
              {error ? <FieldError>{error}</FieldError> : null}
            </View>
          );
        }}
      </form.Field>
    </WizardShell>
  );
}
