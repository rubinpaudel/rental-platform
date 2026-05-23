import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cn } from '@/lib/cn';

interface ScreenProps {
  children: ReactNode;
  className?: string;
  scroll?: boolean;
}

/**
 * Top-level screen wrapper. Owns safe-area insets and a paper background so
 * every screen reads the same. Pass `scroll` when the form/content may
 * exceed the viewport (sign-up).
 */
export function Screen({ children, className, scroll = false }: ScreenProps) {
  const inner = (
    <View className={cn('flex-1 bg-paper px-6 py-6', className)}>{children}</View>
  );
  return (
    <SafeAreaView className="flex-1 bg-paper" edges={['top', 'left', 'right']}>
      {scroll ? (
        <ScrollView
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
        >
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
}
