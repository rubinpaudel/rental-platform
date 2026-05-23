'use client';

import { useState, type FormEvent } from 'react';
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
import type { OrgKind } from '@/lib/org-kind';

export function AccountDetailsStep({
  kind,
  onBack,
}: {
  kind: OrgKind;
  onBack: () => void;
}) {
  const router = useRouter();
  const redirectTo = useSearchParams().get('redirectTo') || '/dashboard';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgNameError, setOrgNameError] = useState<string | null>(null);
  const [verifyPending, setVerifyPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOrgNameError(null);

    if (kind === 'agency' && organizationName.trim().length === 0) {
      setOrgNameError('Geef de naam van je makelaarskantoor op.');
      return;
    }

    setPending(true);

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
      // Read by the v1 user-create hook to set the org kind atomically.
      role: 'landlord',
      orgKind: kind,
      ...(kind === 'agency' ? { organizationName: organizationName.trim() } : {}),
      callbackURL: `${window.location.origin}/verify-email`,
    } as Parameters<typeof authClient.signUp.email>[0]);

    if (signUpError) {
      setPending(false);
      setError(signUpError.message ?? 'Registratie mislukt. Probeer opnieuw.');
      return;
    }

    // requireEmailVerification=false (dev) → already signed in; otherwise the
    // user must click the verification link first.
    const { data: session } = await authClient.getSession();
    setPending(false);
    if (session) {
      router.replace(redirectTo);
    } else {
      setVerifyPending(true);
    }
  }

  if (verifyPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Controleer je inbox</CardTitle>
          <CardDescription>
            We hebben een verificatielink gestuurd naar {email}. Klik erop om je account te
            activeren.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accountgegevens</CardTitle>
        <CardDescription>
          {kind === 'agency' ? 'Makelaarskantoor' : 'Private verhuur'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error && <Alert tone="error">{error}</Alert>}
          <div className="space-y-1.5">
            <Label htmlFor="name">Je naam</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {kind === 'agency' && (
            <div className="space-y-1.5">
              <Label htmlFor="organizationName">Naam makelaarskantoor</Label>
              <Input
                id="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                aria-invalid={Boolean(orgNameError)}
              />
              {orgNameError && <p className="text-sm text-danger">{orgNameError}</p>}
            </div>
          )}
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
          <div className="space-y-1.5">
            <Label htmlFor="password">Wachtwoord</Label>
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
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onBack} disabled={pending}>
              Terug
            </Button>
            <Button type="submit" className="flex-1" disabled={pending}>
              {pending && <Spinner />}
              Account aanmaken
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
