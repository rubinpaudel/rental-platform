import { Pressable, type PressableProps, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { Text } from './text';
import { Spinner } from './spinner';
import { cn } from '@/lib/cn';

type Tone = 'primary' | 'ghost';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  children: ReactNode;
  tone?: Tone;
  loading?: boolean;
  className?: string;
  style?: ViewStyle;
}

const TONES: Record<Tone, { container: string; label: string }> = {
  primary: {
    container: 'bg-accent active:bg-accent-hover',
    label: 'text-paper',
  },
  ghost: {
    container: 'bg-transparent',
    label: 'text-ink',
  },
};

export function Button({
  children,
  tone = 'primary',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const t = TONES[tone];
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(
        'h-12 flex-row items-center justify-center gap-2 rounded-lg px-4',
        t.container,
        isDisabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {loading ? <Spinner tone={tone === 'primary' ? 'paper' : 'ink'} /> : null}
      <Text className={cn('text-base font-medium', t.label)}>{children}</Text>
    </Pressable>
  );
}
