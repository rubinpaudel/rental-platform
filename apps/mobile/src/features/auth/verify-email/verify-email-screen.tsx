import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { AuthShell } from '@/features/shell/auth-shell';
import { authClient, useSession } from '@/lib/auth/auth-client';

const t = getTranslator();

type State = 'working' | 'failed';

/**
 * Deep-link landing for the verification email. Better Auth's Expo plugin
 * rewrites the API's `callbackURL` into `plekje://(auth)/verify-email?token=...`,
 * so the OS opens this route directly with the token in query params.
 *
 * Two paths to success:
 *  1. Server's `autoSignInAfterVerification` already set a session — we
 *     detect it via `useSession()` and forward to `(app)`.
 *  2. Defensive fallback: explicit `verifyEmail({ query: { token } })` call.
 */
export function VerifyEmailScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { data: session, isPending } = useSession();
  const [state, setState] = useState<State>('working');
  const ranToken = useRef(false);

  useEffect(() => {
    if (session?.user) {
      router.replace('/(app)');
      return;
    }
    if (isPending) return;

    if (token && !ranToken.current) {
      ranToken.current = true;
      authClient.verifyEmail({ query: { token } }).then(({ error }) => {
        if (error) setState('failed');
        else router.replace('/(app)');
      });
      return;
    }
    if (!token) setState('failed');
  }, [session, isPending, token, router]);

  return (
    <AuthShell>
      <View className="gap-2">
        <Text className="text-2xl font-medium tracking-tight">
          {state === 'failed'
            ? t('auth.verifyEmail.title.failed')
            : t('auth.verifyEmail.title.working')}
        </Text>
        <Text className="text-sm text-ink-soft">
          {state === 'failed'
            ? t('auth.verifyEmail.description.failed')
            : t('auth.verifyEmail.description.working')}
        </Text>
      </View>

      <View className="mt-8">
        {state === 'failed' ? (
          <Link
            href="/(auth)/sign-in"
            className="text-sm font-medium text-ink underline"
          >
            {t('auth.common.backToSignIn')}
          </Link>
        ) : (
          <Spinner />
        )}
      </View>
    </AuthShell>
  );
}
