'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@rental-platform/ui';
import type { OrgKind } from '@/lib/org-kind';

const OPTIONS: { kind: OrgKind; index: string; title: string; description: string }[] = [
  {
    kind: 'agency',
    index: '01',
    title: 'Ik ben een makelaar',
    description: 'Een kantoor met meerdere agenten. Nodig je team uit.',
  },
  {
    kind: 'private',
    index: '02',
    title: 'Ik verhuur mijn eigen pand',
    description: 'Een private eigenaar. Optioneel één mede-eigenaar.',
  },
];

export function AccountTypeStep({ onPick }: { onPick: (kind: OrgKind) => void }) {
  return (
    <Card>
      <CardHeader>
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
          Stap 1 van 2
        </p>
        <CardTitle>Account aanmaken</CardTitle>
        <CardDescription>
          Hoe verhuur je? Deze keuze bepaalt je werkomgeving en kan later niet
          gewijzigd worden.
        </CardDescription>
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
