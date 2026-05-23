import { cn } from '@rental-platform/ui';

/** Editorial wordmark: serif name with an accent terminal dot. */
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
        'font-display text-[1.35rem] leading-none font-medium tracking-[-0.02em]',
        tone === 'paper' ? 'text-paper' : 'text-ink',
        className,
      )}
    >
      Huurplatform
      <span className={tone === 'paper' ? 'text-[#c7b285]' : 'text-accent'}>.</span>
    </span>
  );
}
