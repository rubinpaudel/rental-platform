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
 *
 * Layout is an outer full-bleed white `View` + an inner `SafeAreaView` that
 * pads only top/left/right. The outer view paints white *under* the home
 * indicator too, so the bottom unsafe area inherits the page background
 * instead of falling through to the host's system gray. Excluding `bottom`
 * from the safe-area lets the on-screen keyboard come up flush against the
 * form when an input is focused.
 */
export function Screen({ children, className, scroll = false }: ScreenProps) {
  const inner = (
    <View
      className={cn('flex-1 px-6 py-6', className)}
    >
      {children}
    </View>
  );
  return (
    <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
      <SafeAreaView
        style={{ flex: 1 }}
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
    </View>
  );
}
