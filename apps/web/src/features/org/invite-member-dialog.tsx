'use client';

import { useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Spinner,
} from '@rental-platform/ui';
import { authClient } from '@/lib/auth/auth-client';
import { copyFor, type OrgKind } from '@/lib/org-kind';

export function InviteMemberDialog({ kind }: { kind: OrgKind }) {
  const copy = copyFor(kind);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  function reset() {
    setEmail('');
    setError(null);
    setSentTo(null);
    setPending(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSentTo(null);

    const { error: inviteError } = await authClient.organization.inviteMember({
      email,
      role: copy.inviteRole,
    });

    setPending(false);

    if (inviteError) {
      // Private orgs allow exactly one co-owner; the backend enforces the cap
      // and returns 409 (or 403 for kinds that can't invite at all).
      if (copy.inviteCapped && (inviteError.status === 409 || inviteError.status === 403)) {
        setError('Limit reached — een private verhuur kan maar één mede-eigenaar hebben.');
      } else {
        setError(inviteError.message ?? 'Uitnodigen mislukt. Probeer opnieuw.');
      }
      return;
    }

    setSentTo(email);
    setEmail('');
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {copy.inviteLabel}
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 backdrop-blur-sm px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{copy.inviteLabel}</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {sentTo && (
              <Alert tone="success">Uitnodiging verstuurd naar {sentTo}.</Alert>
            )}
            {error && <Alert tone="error">{error}</Alert>}
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">E-mailadres</Label>
              <Input
                id="invite-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naam@voorbeeld.be"
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Sluiten
            </Button>
            <Button type="submit" disabled={pending || !email}>
              {pending && <Spinner />}
              Verstuur uitnodiging
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
