import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/ui/screen';
import { Wordmark } from './wordmark';

/**
 * Minimal placeholder shell shared by every auth screen: wordmark up top,
 * scrollable form region beneath. Anything richer (brand panel, editorial
 * copy) waits for the brand handoff.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <Screen scroll className="px-6 py-4">
      <View className="pb-6">
        <Wordmark />
      </View>
      <View className="flex-1 justify-center">{children}</View>
    </Screen>
  );
}
