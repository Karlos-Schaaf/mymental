import { Stack, router, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from '../src/firebase/auth';
import { NewEntryProvider } from '../src/context/NewEntryContext';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthentication = segments[0] === 'authentication';
    const inOnboarding = segments[0] === 'onboarding';

    // User is logged out.
    if (!user) {
      if (!inAuthentication) {
        router.replace('/authentication/login');
      }
      return;
    }

    // User exists but has not entered a name yet.
    // Treat this as onboarding not completed.
    const needsOnboarding = !user.displayName;

    if (needsOnboarding) {
      if (!inOnboarding) {
        router.replace('/onboarding');
      }
      return;
    }

    // User has completed onboarding.
    if (inAuthentication || inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
    return null;
  }

  return (
    <NewEntryProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="authentication/login" />
        <Stack.Screen name="authentication/signup" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </NewEntryProvider>
  );
}