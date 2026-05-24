import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // Each Stack screen renders inside a React-Navigation native-stack
        // container that defaults to the system bg (light gray on iOS). Force
        // it white so Screen's full-bleed paint extends edge to edge.
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    />
  );
}
