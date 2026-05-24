import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  defaultsForStep,
  domicileStepSchema,
} from '@rental-platform/profile-schema';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import { SegmentedRadioField } from '../fields/segmented-radio-field';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

export function DomicileStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit, skip } = useWizardStep({
    step: 'domicile',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('domicile', profile) as { willingToDomicile: boolean })
      : { willingToDomicile: false }),
    validators: { onSubmit: domicileStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('domicile', profile);
  const copy = STEP_COPY.domicile;

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
      <form.Field name="willingToDomicile">
        {(field) => (
          <SegmentedRadioField
            value={field.state.value ? 'yes' : 'no'}
            onChange={(v) => field.handleChange(v === 'yes')}
            options={[
              { value: 'yes', label: t('profile.wizard.step.domicile.yes') },
              { value: 'no', label: t('profile.wizard.step.domicile.no') },
            ]}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>
    </WizardShell>
  );
}
