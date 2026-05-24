import { useEffect } from 'react';
import { View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { Spinner } from 'heroui-native';
import { useProfile } from '@/features/profile/profile-context';
import { useResumeStep } from '@/features/profile/wizard/use-resume-step';
import { Screen } from '@/components/ui/screen';

/**
 * Resume resolver. Reads the cached profile + the local skipped-set,
 * computes the next step to show, and replaces the route with it.
 * Nothing visible — just a spinner while we figure out where to send
 * the user. The wizard URL itself (`/profile/wizard`) never stays in
 * the navigation stack.
 *
 * If everything is already answered (or explicitly skipped), redirects
 * out to `/profile` — the overview (PR 4) handles "all done" UX.
 */
export default function WizardIndex() {
  const router = useRouter();
  const { profile } = useProfile();
  const { resumeStep, loading } = useResumeStep(profile);

  useEffect(() => {
    if (loading || !resumeStep) return;
    router.replace(`/profile/wizard/${resumeStep}` as never);
  }, [loading, resumeStep, router]);

  // Wizard complete — bounce straight to overview without rendering a
  // flash of the spinner.
  if (!loading && !resumeStep) return <Redirect href="/profile" />;

  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </View>
    </Screen>
  );
}
