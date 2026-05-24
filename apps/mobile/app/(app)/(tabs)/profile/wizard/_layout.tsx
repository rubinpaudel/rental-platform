import { View } from 'react-native';
import { Stack } from 'expo-router';
import { Alert, Spinner } from 'heroui-native';
import { getTranslator } from '@rental-platform/i18n';
import { useProfile } from '@/features/profile/profile-context';
import { Screen } from '@/components/ui/screen';

const t = getTranslator();

/**
 * Gates the wizard stack on the profile fetch finishing — step screens
 * read defaults from `profile` and the resume logic needs the DTO to
 * decide where to land. Showing a spinner here keeps every step file
 * free of `if (!profile) return null` plumbing.
 */
export default function WizardLayout() {
  const { profile, isLoading, error } = useProfile();

  if (error && !profile) {
    return (
      <Screen>
        <Alert status="danger">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert>
      </Screen>
    );
  }

  if (isLoading || !profile) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spinner />
        </View>
      </Screen>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
