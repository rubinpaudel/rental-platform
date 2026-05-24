'use client';

import { useRouter } from 'next/navigation';
import { getTranslator } from '@rental-platform/i18n';
import { Button } from '@rental-platform/ui';
import { useFlow } from '@/features/listing-flow/flow-context';
import { FlowFooter } from '@/features/listing-flow/flow-footer';
import { useFlowGuard } from '@/features/listing-flow/hooks/use-flow-guard';

const t = getTranslator();
const MAX_LENGTH = 500;

export default function DescriptionStepPage() {
  const router = useRouter();
  const ready = useFlowGuard('description');
  const { description, setDescription } = useFlow();

  if (!ready) return null;

  const length = description.length;
  const valid = description.trim().length > 0;

  return (
    <>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          {t('listings.flow.description.title')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('listings.flow.description.subtitle')}
        </p>

        <div className="mt-10">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, MAX_LENGTH))}
            maxLength={MAX_LENGTH}
            rows={7}
            aria-label={t('listings.flow.description.title')}
            className="block w-full resize-y rounded-xl border border-border bg-background p-4 text-base text-foreground outline-none transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-muted-foreground/40 focus-visible:border-foreground"
          />
          <p className="mt-3 text-sm tabular-nums text-muted-foreground">
            {length}/{MAX_LENGTH}
          </p>
        </div>
      </main>

      <FlowFooter step={4} backHref="/listing/new/basics">
        <Button
          type="button"
          disabled={!valid}
          onClick={() => router.push('/listing/new/price')}
        >
          {t('listings.form.next')}
        </Button>
      </FlowFooter>
    </>
  );
}
