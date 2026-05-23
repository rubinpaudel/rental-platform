import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { getTranslator } from '@rental-platform/i18n';
import { Spinner } from 'heroui-native';
import { ConversationalShell } from '@/features/shell/conversational-shell';
import { authClient, useSession } from '@/lib/auth/auth-client';

const t = getTranslator();

type State = 'working' | 'failed';

/**
 * Deep-link landing for the verification email. Better Auth's Expo plugin
 * rewrites the API's `callbackURL` into `plekje://verify-email?token=...`,
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
      router.replace('/');
      return;
    }
    if (isPending) return;

    if (token && !ranToken.current) {
      ranToken.current = true;
      authClient.verifyEmail({ query: { token } }).then(({ error }) => {
        if (error) setState('failed');
        else router.replace('/');
      });
      return;
    }
    if (!token) setState('failed');
  }, [session, isPending, token, router]);

  return (
    <ConversationalShell
      title={
        state === 'failed'
          ? t('auth.verifyEmail.title.failed')
          : t('auth.verifyEmail.title.working')
      }
      description={
        state === 'failed'
          ? t('auth.verifyEmail.description.failed')
          : t('auth.verifyEmail.description.working')
      }
    >
      <View>
        {state === 'failed' ? (
          <Link
            href="/sign-in"
            className="text-sm font-medium text-foreground underline"
          >
            {t('auth.common.backToSignIn')}
          </Link>
        ) : (
          <Spinner />
        )}
      </View>
    </ConversationalShell>
  );
}
