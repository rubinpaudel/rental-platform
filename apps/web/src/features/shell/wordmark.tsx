import { cn } from '@rental-platform/ui';

/** Brand wordmark — lowercase, generously tracked. */
export function Wordmark({
  className,
  tone = 'ink',
}: {
  className?: string;
  tone?: 'ink' | 'paper';
}) {
  return (
    <span
      className={cn(
        'font-display text-[1.35rem] leading-none font-medium tracking-[0.18em] lowercase',
        tone === 'paper' ? 'text-paper' : 'text-ink',
        className,
      )}
    >
      plekje
    </span>
  );
}
