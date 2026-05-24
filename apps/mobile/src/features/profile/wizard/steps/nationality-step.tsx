import { useForm } from '@tanstack/react-form';
import { getTranslator } from '@rental-platform/i18n';
import {
  defaultsForStep,
  nationalityStepSchema,
} from '@rental-platform/profile-schema';
import { useWizardStep } from '../use-wizard-step';
import { WizardShell } from '../wizard-shell';
import { STEP_COPY, applicableStepIndex } from '../step-copy';
import { SegmentedRadioField } from '../fields/segmented-radio-field';
import type { StepScreenProps } from './step-screen.types';

const t = getTranslator();

// Curated short-list — low-fi MVP. A real country picker (full ISO list
// + flag emojis + search) lands once design hands us a brand colour.
const NATIONALITY_OPTIONS = [
  { value: 'BE', label: 'België' },
  { value: 'NL', label: 'Nederland' },
  { value: 'FR', label: 'Frankrijk' },
  { value: 'DE', label: 'Duitsland' },
  { value: 'IT', label: 'Italië' },
  { value: 'ES', label: 'Spanje' },
  { value: 'PT', label: 'Portugal' },
  { value: 'PL', label: 'Polen' },
  { value: 'RO', label: 'Roemenië' },
  { value: 'MA', label: 'Marokko' },
  { value: 'TR', label: 'Turkije' },
] as const;

export function NationalityStep({ mode }: StepScreenProps) {
  const { profile, serverError, isSubmitting, submit, skip } = useWizardStep({
    step: 'nationality',
    mode,
  });

  const form = useForm({
    defaultValues: (profile
      ? (defaultsForStep('nationality', profile) as { nationality: string })
      : { nationality: '' }),
    validators: { onSubmit: nationalityStepSchema },
    onSubmit: ({ value }) => submit(value),
  });

  if (!profile) return null;
  const { index, total } = applicableStepIndex('nationality', profile);
  const copy = STEP_COPY.nationality;

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
      <form.Field name="nationality">
        {(field) => (
          <SegmentedRadioField
            value={field.state.value}
            onChange={field.handleChange}
            options={NATIONALITY_OPTIONS}
            error={field.state.meta.errors[0]?.message}
          />
        )}
      </form.Field>
    </WizardShell>
  );
}
