import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type Tone = 'error' | 'success' | 'info';

const TONES: Record<Tone, string> = {
  error: 'border-danger/30 bg-danger-soft text-danger',
  success: 'border-accent/25 bg-success-soft text-accent',
  info: 'border-line-strong bg-paper text-ink-soft',
};

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
}

export function Alert({ className, tone = 'info', ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-[5px] border px-4 py-3 text-[0.875rem] leading-relaxed',
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
