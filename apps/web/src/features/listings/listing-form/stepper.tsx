import { Check } from 'lucide-react';
import { cn } from '@rental-platform/ui';
import { getTranslator } from '@rental-platform/i18n';
import type { TranslationKey } from '@rental-platform/i18n';

const t = getTranslator();

export type StepperStep = 'basics' | 'address' | 'photos' | 'review';

const STEP_LABELS: Record<StepperStep, TranslationKey> = {
  basics: 'listings.form.step.basics',
  address: 'listings.form.step.address',
  photos: 'listings.form.step.photos',
  review: 'listings.form.step.review',
};

const ALL_STEPS: StepperStep[] = ['basics', 'address', 'photos', 'review'];

export function Stepper({
  current,
  completed = [],
}: {
  current: StepperStep;
  completed?: StepperStep[];
}) {
  return (
    <ol className="flex items-center gap-2 text-sm">
      {ALL_STEPS.map((step, idx) => {
        const isComplete = completed.includes(step);
        const isCurrent = step === current;
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                isComplete
                  ? 'bg-foreground text-background'
                  : isCurrent
                    ? 'bg-foreground/90 text-background'
                    : 'border border-border text-muted-foreground',
              )}
            >
              {isComplete ? <Check className="size-3" /> : idx + 1}
            </span>
            <span
              className={cn(
                'whitespace-nowrap',
                isCurrent
                  ? 'font-medium text-foreground'
                  : isComplete
                    ? 'text-foreground'
                    : 'text-muted-foreground',
              )}
            >
              {t(STEP_LABELS[step])}
            </span>
            {idx < ALL_STEPS.length - 1 && (
              <span aria-hidden className="mx-2 h-px w-8 bg-border" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
