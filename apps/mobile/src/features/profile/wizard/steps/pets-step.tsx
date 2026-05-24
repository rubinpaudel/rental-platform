import { View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  defaultsForStep,
  petsStepSchema,
} from '@rental-platform/profile-schema';
import { FieldError, Label, TextArea } from 'heroui-native';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import { SegmentedRadioField } from '../fields/segmented-radio-field';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

type PetsValue = { hasPets: boolean; petDescription?: string };

export function PetsStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit, skip } = useWizardStep({
    step: 'pets',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('pets', profile) as PetsValue)
      : { hasPets: false, petDescription: '' }),
    validators: { onSubmit: petsStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('pets', profile);
  const copy = STEP_COPY.pets;

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
      <View className="gap-5">
        <form.Field name="hasPets">
          {(field) => (
            <SegmentedRadioField
              value={field.state.value ? 'yes' : 'no'}
              onChange={(v) => field.handleChange(v === 'yes')}
              options={[
                { value: 'yes', label: t('profile.wizard.step.pets.yes') },
                { value: 'no', label: t('profile.wizard.step.pets.no') },
              ]}
              error={field.state.meta.errors[0]?.message}
            />
          )}
        </form.Field>
        <form.Subscribe selector={(s) => s.values.hasPets}>
          {(hasPets) =>
            hasPets ? (
              <form.Field name="petDescription">
                {(field) => {
                  const error = field.state.meta.errors[0]?.message;
                  return (
                    <View className="gap-2">
                      <Label>{t('profile.wizard.step.pets.field.description')}</Label>
                      <TextArea
                        isInvalid={!!error}
                        value={field.state.value ?? ''}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                      />
                      {error ? <FieldError>{error}</FieldError> : null}
                    </View>
                  );
                }}
              </form.Field>
            ) : null
          }
        </form.Subscribe>
      </View>
    </WizardShell>
  );
}
