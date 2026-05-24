import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from 'heroui-native';
import { AuthShell } from './auth-shell';

interface ConversationalShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  /** Sticky button(s) pinned to the bottom of the screen. */
  footer?: ReactNode;
}

/**
 * Stacked / conversational auth screen template. Renders:
 *   ┌──────────────────┐
 *   │  ‹                │  back button (only if router.canGoBack())
 *   │                   │
 *   │  Title            │  left-aligned heading
 *   │  Description      │  left-aligned sub-copy
 *   │                   │
 *   │                   │
 *   │     content       │  vertically centered in the remaining space
 *   │                   │
 *   │                   │
 *   │  [   Footer   ]   │  sticky bottom CTA (full-width button)
 *   └──────────────────┘
 *
 * The back button lets the user step back through the stack — every
 * `router.push` adds a frame, so this mirrors the conversational flow
 * (welcome → sign-in → password, each with its own page).
 */
export function ConversationalShell({
  title,
  description,
  children,
  footer,
}: ConversationalShellProps) {
  const router = useRouter();
  const canGoBack = router.canGoBack();

  return (
    <AuthShell>
      <View style={{ flex: 1 }}>
        {canGoBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => router.back()}
            hitSlop={12}
            className="self-start -ml-2 p-2"
          >
            <Text type="h3" weight="normal">
              ‹
            </Text>
          </Pressable>
        ) : null}

        <View className="mt-8 gap-2">
          <Text type="h2" weight="bold" className="tracking-tight">
            {title}
          </Text>
          {description ? (
            <Text type="body-sm">{description}</Text>
          ) : null}
        </View>

        <View style={{ flex: 1, justifyContent: 'center' }}>{children}</View>

        {footer ? <View className="pb-2 pt-4">{footer}</View> : null}
      </View>
    </AuthShell>
  );
}
