'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getTranslator } from '@rental-platform/i18n';
import type { OrgKind } from '@/lib/org-kind';
import { AccountTypeStep } from './account-type-step';
import { AccountDetailsStep } from './account-details-step';

const t = getTranslator();

/**
 * Two-step on purpose: collapsing the kind picker into the details form
 * makes it too easy to miss, and org kind is immutable after signup.
 */
export function SignUpForm() {
  const [kind, setKind] = useState<OrgKind | null>(null);

  return (
    <div className="space-y-4">
      {kind === null ? (
        <AccountTypeStep onPick={setKind} />
      ) : (
        <AccountDetailsStep kind={kind} onBack={() => setKind(null)} />
      )}
      <p className="text-center text-sm text-ink-soft">
        {t('auth.signUp.haveAccount')}{' '}
        <Link
          href="/sign-in"
          className="font-medium text-accent underline-offset-4 hover:underline"
        >
          {t('auth.signUp.signInCta')}
        </Link>
      </p>
    </div>
  );
}
