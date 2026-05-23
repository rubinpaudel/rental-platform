'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setPending(true);
    setError(null);

    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    setPending(false);
    if (resetError) {
      setError('Deze link is verlopen of ongeldig. Vraag een nieuwe aan.');
      return;
    }
    router.replace('/sign-in');
  }

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ongeldige link</CardTitle>
          <CardDescription>
            Deze reset-link is ongeldig.{' '}
            <Link href="/forgot-password" className="font-medium text-accent underline-offset-4 hover:underline">
              Vraag een nieuwe aan
            </Link>
            .
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nieuw wachtwoord</CardTitle>
        <CardDescription>Kies een nieuw wachtwoord voor je account.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && <Alert tone="error">{error}</Alert>}
          <div className="space-y-1.5">
            <Label htmlFor="password">Nieuw wachtwoord</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Spinner />}
            Wachtwoord opslaan
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
