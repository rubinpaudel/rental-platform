'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTranslator } from '@rental-platform/i18n';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Spinner,
} from '@rental-platform/ui';
import { authClient, useSession } from '@/lib/auth/auth-client';

const t = getTranslator();

export function AcceptInvitationView({ token }: { token: string }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = `/auth/accept-invitation/${token}`;

  async function onAccept() {
    setPending(true);
    setError(null);
    const { error: acceptError } = await authClient.organization.acceptInvitation({
      invitationId: token,
    });
    if (acceptError) {
      setPending(false);
      setError(
        acceptError.status === 404 || acceptError.status === 400
          ? t('acceptInvitation.error.invalid')
          : t('acceptInvitation.error.generic'),
      );
      return;
    }
    router.replace('/dashboard');
  }

  if (isPending) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <Spinner className="text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('acceptInvitation.title.signedOut')}</CardTitle>
          <CardDescription>
            {t('acceptInvitation.description.signedOut')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            onClick={() =>
              router.push(`/auth/sign-in?redirectTo=${encodeURIComponent(nextPath)}`)
            }
          >
            {t('auth.signIn.submit')}
          </Button>
          <Link
            href={`/auth/sign-up?redirectTo=${encodeURIComponent(nextPath)}`}
            className="inline-flex h-10 items-center rounded-[5px] border border-border px-5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.04]"
          >
            {t('auth.signIn.registerCta')}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('acceptInvitation.title.signedIn')}</CardTitle>
        <CardDescription>
          {t('acceptInvitation.description.signedIn', { email: session.user.email })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <Alert variant="destructive">{error}</Alert>}
        <Button className="w-full" disabled={pending} onClick={onAccept}>
          {pending && <Spinner />}
          {t('acceptInvitation.submit')}
        </Button>
      </CardContent>
    </Card>
  );
}
