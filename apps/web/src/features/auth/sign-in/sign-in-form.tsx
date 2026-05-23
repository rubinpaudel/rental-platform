'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTranslator } from '@rental-platform/i18n';
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

const t = getTranslator();

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get('redirectTo') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const { error: signInError } = await authClient.signIn.email({ email, password });

    if (signInError) {
      setPending(false);
      setError(
        signInError.status === 403
          ? t('auth.signIn.error.unverified')
          : t('auth.signIn.error.invalid'),
      );
      return;
    }

    router.replace(redirectTo);
  }

  return (
    <Card>
      <CardHeader>
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
          {t('auth.signIn.eyebrow')}
        </p>
        <CardTitle>{t('auth.signIn.title')}</CardTitle>
        <CardDescription>{t('auth.signIn.description')}</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-5">
          {error && <Alert tone="error">{error}</Alert>}
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('auth.field.email')}</Label>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('auth.field.password')}</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-ink-soft transition-colors hover:text-ink"
              >
                {t('auth.signIn.forgotPassword')}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Spinner />}
            {t('auth.signIn.submit')}
          </Button>
          <p className="text-center text-sm text-ink-soft">
            {t('auth.signIn.noAccount')}{' '}
            <Link
              href="/sign-up"
              className="font-medium text-accent underline-offset-4 hover:underline"
            >
              {t('auth.signIn.registerCta')}
            </Link>
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
