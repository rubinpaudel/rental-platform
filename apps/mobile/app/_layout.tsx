import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
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
 * Redirects between (auth) and (app) based on session presence. Uses the
 * canonical Expo Router auth pattern (useSegments + router.replace) so the
 * route tree itself stays a plain `Slot` and Stack.Screen options live in
 * the per-group layouts.
 */
function AuthSwitch() {
  const { data: session, isPending } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    void SplashScreen.hideAsync();

    // Route groups (parenthesised) are URL-invisible in expo-router 6 —
    // navigate to real screen URLs, not group names. `/` resolves to
    // `(app)/index.tsx` because the `(auth)` group has no own index.
    // Route groups (parenthesised) are URL-invisible in expo-router 6 —
    // navigate to real screen URLs, not group names. `/` resolves to
    // `(app)/index.tsx` because the `(auth)` group has no own index; the
    // unauthenticated entry is `(auth)/welcome.tsx` → `/welcome`.
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
  return <Slot />;
}
