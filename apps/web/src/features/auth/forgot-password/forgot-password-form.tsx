'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Spinner,
} from '@rental-platform/ui';
import { authClient } from '@/lib/auth/auth-client';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const { error: resetError } = await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    });

    setPending(false);
    if (resetError) {
      setError('Er ging iets mis. Probeer het opnieuw.');
      return;
    }
    setSent(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wachtwoord vergeten</CardTitle>
        <CardDescription>
          We sturen je een link om een nieuw wachtwoord in te stellen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sent ? (
          <Alert tone="success">
            Als er een account bestaat voor {email}, is er een reset-link verstuurd.
          </Alert>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && <Alert tone="error">{error}</Alert>}
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending && <Spinner />}
              Stuur reset-link
            </Button>
          </form>
        )}
        <p className="text-center text-sm text-ink-soft">
          <Link href="/sign-in" className="font-medium text-accent underline-offset-4 hover:underline">
            Terug naar inloggen
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
