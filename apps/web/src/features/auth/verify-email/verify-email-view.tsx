'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTranslator } from '@rental-platform/i18n';
import { Spinner } from '@rental-platform/ui';
import { authClient, useSession } from '@/lib/auth/auth-client';

const t = getTranslator();

type State = 'working' | 'failed';

/**
 * Landing for the verification link. Better Auth verifies server-side and
 * redirects here with a session cookie set (autoSignInAfterVerification), so
 * normally we just detect the session and forward to the dashboard. The
 * explicit `token` path is a defensive fallback.
 */
export function VerifyEmailView() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');
  const { data: session, isPending } = useSession();
  const [state, setState] = useState<State>('working');
  const ranToken = useRef(false);

  useEffect(() => {
    if (session?.user) {
      router.replace('/dashboard');
      return;
    }
    if (isPending) return;

    if (token && !ranToken.current) {
      ranToken.current = true;
      authClient.verifyEmail({ query: { token } }).then(({ error }) => {
        if (error) setState('failed');
        else router.replace('/dashboard');
      });
      return;
    }
    if (!token) setState('failed');
  }, [session, isPending, token, router]);

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight text-ink">
        {state === 'failed'
          ? t('auth.verifyEmail.title.failed')
          : t('auth.verifyEmail.title.working')}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        {state === 'failed'
          ? t('auth.verifyEmail.description.failed')
          : t('auth.verifyEmail.description.working')}
      </p>

      <div className="mt-8">
        {state === 'failed' ? (
          <Link
            href="/auth/sign-in"
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            {t('auth.common.backToSignIn')}
          </Link>
        ) : (
          <Spinner className="text-ink-soft" />
        )}
      </div>
    </div>
  );
}
