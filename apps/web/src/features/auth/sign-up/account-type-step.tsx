'use client';

import { getTranslator } from '@rental-platform/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rental-platform/ui';
import type { OrgKind } from '@/lib/org-kind';

const t = getTranslator();

const OPTIONS: { kind: OrgKind; index: string; title: string; description: string }[] = [
  {
    kind: 'agency',
    index: '01',
    title: t('auth.signUp.kind.agency.title'),
    description: t('auth.signUp.kind.agency.description'),
  },
  {
    kind: 'private',
    index: '02',
    title: t('auth.signUp.kind.private.title'),
    description: t('auth.signUp.kind.private.description'),
  },
];

export function AccountTypeStep({ onPick }: { onPick: (kind: OrgKind) => void }) {
  return (
    <Card>
      <CardHeader>
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
          {t('auth.signUp.stepIndicator.kind')}
        </p>
        <CardTitle>{t('auth.signUp.title')}</CardTitle>
        <CardDescription>{t('auth.signUp.kindDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.kind}
            type="button"
            onClick={() => onPick(opt.kind)}
            className="group flex w-full items-start gap-4 rounded-[7px] border border-line bg-paper/40 p-5 text-left transition-all duration-200 hover:border-accent hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            <span className="font-display text-[0.95rem] font-medium text-ink-faint transition-colors group-hover:text-accent">
              {opt.index}
            </span>
            <span className="flex-1">
              <span className="block font-display text-[1.15rem] font-medium tracking-[-0.01em] text-ink">
                {opt.title}
              </span>
              <span className="mt-1 block text-[0.875rem] leading-relaxed text-ink-soft">
                {opt.description}
              </span>
            </span>
            <span
              aria-hidden
              className="mt-1 text-ink-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
            >
              →
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
