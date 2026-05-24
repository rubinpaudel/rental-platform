import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Alert, Button, Spinner, Text } from 'heroui-native';
import { Screen } from '@/components/ui/screen';
import { ProgressBar } from './progress-bar';

interface CtaSpec {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

interface WizardShellProps {
  /** "wizard" hides the back button (forward-only flow). "edit" shows it. */
  mode: 'wizard' | 'edit';
  /** 1-based index — drives the progress bar in wizard mode. */
  stepIndex: number;
  totalSteps: number;
  title: string;
  description?: string;
  /** Inline error from a failed PATCH (server validation, network). */
  serverError?: string | null;
  /** Always-present primary CTA pinned to the bottom of the screen. */
  primary: CtaSpec;
  /** Optional secondary CTA — used for "Sla over" on optional steps. */
  secondary?: CtaSpec;
  children: ReactNode;
}

/**
 * Layout chrome for every wizard step screen:
 *
 *   ┌──────────────────────┐
 *   │  ‹  ▰▰▰▰▰▱▱▱▱▱▱▱▱▱  │  back (edit mode only) + progress bar
 *   │                       │
 *   │  Title                │  question, left-aligned
 *   │  Description          │
 *   │                       │
 *   │   ─ form fields ─     │  content fills middle
 *   │                       │
 *   │  ┌───────────────┐    │  primary CTA — always present, sticky
 *   │  │   Doorgaan    │    │
 *   │  └───────────────┘    │
 *   │   Sla over            │  optional secondary
 *   └──────────────────────┘
 *
 * The primary CTA is the "always button" requested by product: present
 * on every wizard screen, same label per step, drives the flow forward.
 * Identical visual position keeps the bottom of the screen predictable
 * across all 14 questions.
 */
export function WizardShell({
  mode,
  stepIndex,
  totalSteps,
  title,
  description,
  serverError,
  primary,
  secondary,
  children,
}: WizardShellProps) {
  const router = useRouter();
  const canGoBack = mode === 'edit' && router.canGoBack();

  return (
    <Screen>
      <View style={{ flex: 1 }}>
        <View className="flex-row items-center gap-3">
          {canGoBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Terug"
              onPress={() => router.back()}
              hitSlop={12}
              className="-ml-2 p-2"
            >
              <Text type="h3" weight="normal">
                ‹
              </Text>
            </Pressable>
          ) : null}
          {mode === 'wizard' ? (
            <View style={{ flex: 1 }}>
              <ProgressBar current={stepIndex} total={totalSteps} />
            </View>
          ) : null}
        </View>

        <View className="mt-8 gap-2">
          <Text type="h2" weight="bold" className="tracking-tight">
            {title}
          </Text>
          {description ? <Text type="body-sm">{description}</Text> : null}
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 24 }}>
          {serverError ? (
            <View className="mb-4">
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Description>{serverError}</Alert.Description>
                </Alert.Content>
              </Alert>
            </View>
          ) : null}
          {children}
        </View>

        <View className="gap-3 pb-2 pt-4">
          <Button
            isDisabled={primary.isDisabled || primary.isLoading}
            onPress={primary.onPress}
          >
            {primary.isLoading ? (
              <Spinner />
            ) : (
              <Button.Label>{primary.label}</Button.Label>
            )}
          </Button>
          {secondary ? (
            <Button
              variant="ghost"
              isDisabled={secondary.isDisabled || secondary.isLoading}
              onPress={secondary.onPress}
            >
              {secondary.isLoading ? (
                <Spinner />
              ) : (
                <Button.Label>{secondary.label}</Button.Label>
              )}
            </Button>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}
