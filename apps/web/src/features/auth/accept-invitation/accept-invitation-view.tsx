'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

export function AcceptInvitationView({ token }: { token: string }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = `/accept-invitation/${token}`;

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
          ? 'Deze uitnodiging is ongeldig of al gebruikt.'
          : 'Uitnodiging accepteren mislukt. Probeer opnieuw.',
      );
      return;
    }
    router.replace('/dashboard');
  }

  if (isPending) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <Spinner className="text-ink-soft" />
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Je bent uitgenodigd</CardTitle>
          <CardDescription>
            Meld je aan of registreer om de uitnodiging te accepteren.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            onClick={() => router.push(`/sign-in?redirectTo=${encodeURIComponent(nextPath)}`)}
          >
            Inloggen
          </Button>
          <Link
            href={`/sign-up?redirectTo=${encodeURIComponent(nextPath)}`}
            className="inline-flex h-10 items-center rounded-[5px] border border-line-strong px-5 text-sm font-medium text-ink transition-colors hover:bg-ink/[0.04]"
          >
            Registreren
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uitnodiging accepteren</CardTitle>
        <CardDescription>
          Je bent ingelogd als {session.user.email}. Word lid van de organisatie.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <Alert tone="error">{error}</Alert>}
        <Button className="w-full" disabled={pending} onClick={onAccept}>
          {pending && <Spinner />}
          Accepteer uitnodiging
        </Button>
      </CardContent>
    </Card>
  );
}
