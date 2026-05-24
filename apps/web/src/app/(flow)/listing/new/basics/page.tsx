'use client';

import { type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getTranslator } from '@rental-platform/i18n';
import { Button } from '@rental-platform/ui';
import { useFlow, type FlowBasics } from '@/features/listing-flow/flow-context';
import { FlowFooter } from '@/features/listing-flow/flow-footer';
import { Counter } from '@/features/listing-flow/counter';
import { useFlowGuard } from '@/features/listing-flow/hooks/use-flow-guard';

const t = getTranslator();

function isBasicsComplete(b: FlowBasics): boolean {
  return b.bedrooms >= 1 && (b.surfaceM2 ?? 0) > 0;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-5">
      <span className="text-base font-medium text-foreground">{label}</span>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 first:mt-12">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export default function BasicsStepPage() {
  const router = useRouter();
  const ready = useFlowGuard('basics');
  const { basics, setBasics } = useFlow();

  if (!ready) return null;

  return (
    <>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          {t('listings.flow.basics.title')}
        </h1>

        <Section title={t('listings.flow.basics.rooms.question')}>
          <Row label={t('listings.flow.basics.bedrooms')}>
            <Counter
              value={basics.bedrooms}
              onChange={(bedrooms) => setBasics({ bedrooms })}
              min={1}
              max={20}
              ariaLabel={t('listings.flow.basics.bedrooms')}
            />
          </Row>
        </Section>

        <Section title={t('listings.flow.basics.surface.question')}>
          <Row label={t('listings.flow.basics.surface')}>
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                value={basics.surfaceM2 ?? ''}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 5);
                  setBasics({ surfaceM2: digits === '' ? null : Number(digits) });
                }}
                placeholder="—"
                className="w-16 border-0 bg-transparent p-0 text-right text-base text-foreground tabular-nums outline-none placeholder:text-muted-foreground/40"
                aria-label={t('listings.flow.basics.surface')}
              />
              <span className="text-base text-muted-foreground">
                {t('listings.flow.basics.surface.unit')}
              </span>
            </div>
          </Row>
        </Section>
      </main>

      <FlowFooter step={3} backHref="/listing/new/address">
        <Button
          type="button"
          disabled={!isBasicsComplete(basics)}
          onClick={() => router.push('/listing/new/description')}
        >
          {t('listings.form.next')}
        </Button>
      </FlowFooter>
    </>
  );
}
