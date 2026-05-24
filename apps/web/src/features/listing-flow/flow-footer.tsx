import type { ReactNode } from 'react';
import Link from 'next/link';
import { getTranslator } from '@rental-platform/i18n';

const t = getTranslator();

export const FLOW_TOTAL_STEPS = 9;

export function FlowFooter({
  step,
  backHref,
  children,
}: {
  step: number;
  backHref: string;
  children?: ReactNode;
}) {
  const fraction = Math.min(step / FLOW_TOTAL_STEPS, 1);
  return (
    <footer className="sticky bottom-0 border-t border-border bg-background">
      <div
        className="h-[3px] bg-foreground transition-[width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ width: `${fraction * 100}%` }}
        aria-hidden
      />
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          href={backHref}
          className="text-sm font-medium text-foreground underline-offset-4 transition-colors hover:underline"
        >
          {t('listings.form.back')}
        </Link>
        {children}
      </div>
    </footer>
  );
}
