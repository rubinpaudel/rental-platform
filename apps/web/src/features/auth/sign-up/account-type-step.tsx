'use client';

import { getTranslator } from '@rental-platform/i18n';
import type { OrgKind } from '@/lib/org-kind';

const t = getTranslator();

const OPTIONS: { kind: OrgKind; title: string; description: string }[] = [
  {
    kind: 'agency',
    title: t('auth.signUp.kind.agency.title'),
    description: t('auth.signUp.kind.agency.description'),
  },
  {
    kind: 'private',
    title: t('auth.signUp.kind.private.title'),
    description: t('auth.signUp.kind.private.description'),
  },
];

export function AccountTypeStep({ onPick }: { onPick: (kind: OrgKind) => void }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
        {t('auth.signUp.stepIndicator.kind')}
      </p>
      <h1 className="mt-1 text-2xl font-medium tracking-tight text-ink">
        {t('auth.signUp.title')}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t('auth.signUp.kindDescription')}
      </p>

      <div className="mt-8 space-y-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.kind}
            type="button"
            onClick={() => onPick(opt.kind)}
            className="flex w-full items-start justify-between gap-4 rounded-md border border-line bg-paper p-4 text-left transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
          >
            <span className="flex-1">
              <span className="block text-sm font-medium text-ink">
                {opt.title}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                {opt.description}
              </span>
            </span>
            <span aria-hidden className="mt-0.5 text-ink-faint">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
