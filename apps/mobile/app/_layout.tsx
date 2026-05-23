import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HeroUINativeProvider } from 'heroui-native';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useSession } from '@/lib/auth/auth-client';
import '../global.css';

// Keep the splash up until the cached session has resolved — avoids a flash
// of the sign-in screen on a warm start where the user is already signed in.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be hidden in dev/web; ignore.
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* SafeAreaProvider must be in the tree for `SafeAreaView` AND for
        * HeroUI's internal `SafeAreaListener` to read real insets. Without
        * it, both fall back to zero/default insets and the layout looks
        * mis-sized (form ends ~75% down, system gray bleeds in below). */}
      <SafeAreaProvider>
        <HeroUINativeProvider>
          <StatusBar style="dark" />
          <AuthSwitch />
        </HeroUINativeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Redirects between (auth) and (app) based on session presence.
 *
 * IMPORTANT: the root is a `<Stack>` with explicit `Stack.Screen` entries
 * for each route group, NOT a `<Slot>`. expo-router's navigation actions
 * use the *group name* (e.g. `(app)`) as the screen name when switching
 * between groups; a Slot doesn't register named children and silently
 * drops those actions with "no navigator named '(app)'". An explicit Stack
 * gives the action a target.
 */
function AuthSwitch() {
  const { data: session, isPending } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    void SplashScreen.hideAsync();

    // Route groups are URL-invisible in expo-router 6 — navigate to real
    // screen URLs (`/`, `/welcome`), not group names. `/` resolves to
    // `(app)/index.tsx`; the unauthenticated entry is `(auth)/welcome.tsx`.
    const inAuthGroup = segments[0] === '(auth)';
    if (session && inAuthGroup) {
      router.replace('/');
    } else if (!session && !inAuthGroup) {
      router.replace('/welcome');
    }
  }, [session, isPending, segments, router]);

  if (isPending) {
    // Splash is still visible; render a page-coloured backdrop so
    // first-paint matches the splash background and avoids a black flash.
    return <View className="flex-1" style={{ backgroundColor: '#ffffff' }} />;
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
