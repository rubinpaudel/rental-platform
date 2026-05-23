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
 * App-shell wrapper: owns safe-area insets and the page background so every
 * screen reads the same. Pass `scroll` when content may exceed the viewport
 * (sign-up). No HeroUI equivalent — this is layout chrome, not a primitive.
 */
export function Screen({ children, className, scroll = false }: ScreenProps) {
  const inner = (
    <View className={cn('flex-1 bg-background px-6 py-6', className)}>
      {children}
    </View>
  );
  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={['top', 'left', 'right']}
    >
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
