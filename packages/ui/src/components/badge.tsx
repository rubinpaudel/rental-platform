import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type Tone = 'neutral' | 'accent';

const TONES: Record<Tone, string> = {
  neutral: 'border-line-strong text-ink-soft',
  accent: 'border-accent bg-accent text-paper',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em]',
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
