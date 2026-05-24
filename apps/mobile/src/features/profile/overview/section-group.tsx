import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  isStepAnswered,
  isStepApplicable,
  STEPS,
  type ProfileDto,
  type ProfileSection,
  type StepId,
} from '@rental-platform/profile-schema';
import { getTranslator, type TranslationKey } from '@rental-platform/i18n';
import { Card, Text } from 'heroui-native';
import { STEP_COPY } from '../wizard/step-copy';
import { stepDisplayValue } from './value-formatters';

const t = getTranslator();

interface SectionGroupProps {
  section: ProfileSection;
  profile: ProfileDto;
}

const SECTION_LABEL_KEY: Readonly<Record<ProfileSection, TranslationKey>> = {
  identity: 'profile.section.identity',
  household: 'profile.section.household',
  employment: 'profile.section.employment',
  financial: 'profile.section.financial',
  move: 'profile.section.move',
  about: 'profile.section.about',
};

/**
 * Section card on the overview. Lists each applicable step in the
 * section with its current value (or "—"), tap-to-edit per row. Header
 * shows answered/total count so the user sees at a glance which
 * sections still want input.
 */
export function SectionGroup({ section, profile }: SectionGroupProps) {
  const router = useRouter();
  const steps = STEPS.filter(
    (s) => s.section === section && isStepApplicable(s, profile),
  );
  const answered = steps.filter((s) => isStepAnswered(s, profile)).length;

  return (
    <Card>
      <View className="gap-3 p-4">
        <View className="flex-row items-center justify-between">
          <Text type="h4" weight="semibold">
            {t(SECTION_LABEL_KEY[section])}
          </Text>
          <Text type="body-sm">
            {answered} / {steps.length}
          </Text>
        </View>
        <View className="gap-2">
          {steps.map((step) => (
            <StepRow
              key={step.id}
              step={step.id}
              profile={profile}
              onPress={() =>
                router.push(`/profile/wizard/${step.id}?edit=1` as never)
              }
            />
          ))}
        </View>
      </View>
    </Card>
  );
}

interface StepRowProps {
  step: StepId;
  profile: ProfileDto;
  onPress: () => void;
}

function StepRow({ step, profile, onPress }: StepRowProps) {
  const label = t(STEP_COPY[step].title);
  const value = stepDisplayValue(step, profile);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center justify-between gap-3 rounded-md py-2"
    >
      <View style={{ flex: 1 }} className="gap-0.5">
        <Text type="body-sm">{label}</Text>
        <Text type="body" weight="semibold">
          {value ?? '—'}
        </Text>
      </View>
      <Text type="h4" weight="normal">
        ›
      </Text>
    </Pressable>
  );
}
