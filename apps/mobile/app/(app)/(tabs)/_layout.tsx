import { Tabs } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';

const t = getTranslator();

/**
 * Two-tab home shell. Wizard routes live under `profile/wizard/` so the
 * tab bar stays visible during onboarding — it isn't a modal flow at
 * MLP. Polish to hide it during the wizard is a v7+ concern.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'beside-icon',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('tabs.home') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: t('tabs.profile') }}
      />
    </Tabs>
  );
}
