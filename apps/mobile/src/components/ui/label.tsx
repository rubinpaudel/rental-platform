import type { ReactNode } from 'react';
import { Text } from './text';
import { cn } from '@/lib/cn';

interface LabelProps {
  children: ReactNode;
  className?: string;
  nativeID?: string;
}

export function Label({ children, className, nativeID }: LabelProps) {
  return (
    <Text
      nativeID={nativeID}
      className={cn('text-sm font-medium text-ink', className)}
    >
      {children}
    </Text>
  );
}
