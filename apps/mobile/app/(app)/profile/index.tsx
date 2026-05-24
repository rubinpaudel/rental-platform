import { View } from 'react-native';
import { Link } from 'expo-router';
import { Button, Text } from 'heroui-native';
import { getTranslator } from '@rental-platform/i18n';
import { Screen } from '@/components/ui/screen';
import { useProfile } from '@/features/profile/profile-context';

const t = getTranslator();

/**
 * Placeholder overview for PR 3. Just enough so finishing the wizard
 * doesn't land the user on a 404 — PR 4 replaces this with the real
 * completeness-ring + section-cards layout.
 */
export default function ProfileIndex() {
  const { profile } = useProfile();
  const pct = profile?.completeness ?? 0;

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 16 }}>
        <View className="gap-2 pt-4">
          <Text type="h2" weight="bold" className="tracking-tight">
            {t('profile.overview.title')}
          </Text>
          <Text type="body-sm">
            {t('profile.overview.completeness', { pct })}
          </Text>
        </View>

        <Link href="/profile/wizard" asChild>
          <Button>
            <Button.Label>{t('profile.overview.startWizardCta')}</Button.Label>
          </Button>
        </Link>
      </View>
    </Screen>
  );
}
