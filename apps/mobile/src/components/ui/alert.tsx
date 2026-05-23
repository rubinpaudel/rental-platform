import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from './text';
import { cn } from '@/lib/cn';

type Tone = 'error' | 'success';

interface AlertProps {
  tone: Tone;
  children: ReactNode;
  className?: string;
}

const TONES: Record<Tone, { container: string; text: string }> = {
  error: { container: 'bg-danger-soft border-danger/30', text: 'text-danger' },
  success: {
    container: 'bg-success-soft border-success/30',
    text: 'text-success',
  },
};

export function Alert({ tone, children, className }: AlertProps) {
  const t = TONES[tone];
  return (
    <View
      accessibilityRole="alert"
      className={cn('rounded-lg border px-3 py-2', t.container, className)}
    >
      <Text className={cn('text-sm', t.text)}>{children}</Text>
    </View>
  );
}
