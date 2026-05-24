import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/ui/screen';

/**
 * Minimal shell shared by every auth screen. Just a `Screen` with default
 * top padding. The conversational chrome (back button / title / description /
 * sticky footer) lives in `ConversationalShell`, which composes this one.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <Screen scroll>
      <View style={{ flex: 1, paddingTop: 8 }}>{children}</View>
    </Screen>
  );
}
