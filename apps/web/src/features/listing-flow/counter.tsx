'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@rental-platform/ui';

export function Counter({
  value,
  onChange,
  min = 0,
  max = 99,
  ariaLabel,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  ariaLabel: string;
}) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div className="flex items-center gap-3" role="group" aria-label={ariaLabel}>
      <StepButton onClick={dec} disabled={atMin} icon={Minus} label={`${ariaLabel} −`} />
      <span
        aria-live="polite"
        aria-atomic="true"
        className="w-6 text-center text-base text-foreground"
      >
        {value}
      </span>
      <StepButton onClick={inc} disabled={atMax} icon={Plus} label={`${ariaLabel} +`} />
    </div>
  );
}

function StepButton({
  onClick,
  disabled,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  icon: typeof Minus;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'flex size-8 items-center justify-center rounded-full border border-border text-foreground',
        'transition-[border-color,color,transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]',
        'active:scale-[0.92]',
        disabled
          ? 'cursor-not-allowed opacity-30'
          : 'hover:border-foreground hover:text-foreground',
      )}
    >
      <Icon className="size-4 stroke-[1.75]" />
    </button>
  );
}
