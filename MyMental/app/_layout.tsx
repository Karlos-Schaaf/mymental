import { Stack, router, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from '../src/firebase/auth';
import { subscribeToUserDoc } from '../src/firebase/firestore';
import { NewEntryProvider } from '../src/context/NewEntryContext';

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userDocLoading, setUserDocLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<
    boolean | null
  >(null);

  const segments = useSegments();

  // Listen for Firebase authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (!currentUser) {
        setOnboardingCompleted(null);
        setUserDocLoading(false);
      } else {
        setUserDocLoading(true);
      }
    });

    return unsubscribe;
  }, []);

  // Listen for changes to the user's Firestore document
  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = subscribeToUserDoc(user.uid, (userDoc) => {
      const completed =
        userDoc?.onboardingCompleted === true ||
        (userDoc?.onboardingCompleted === undefined &&
          !!user.displayName);

      setOnboardingCompleted(completed);
      setUserDocLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Handle navigation
  useEffect(() => {
    if (authLoading || userDocLoading) {
      return;
    }

    const inAuthentication = segments[0] === 'authentication';
    const inOnboarding = segments[0] === 'onboarding';

    // Not signed in
    if (!user) {
      if (!inAuthentication) {
        router.replace('/authentication/login');
      }
      return;
    }

    // Signed in but onboarding is not finished
    if (onboardingCompleted === false) {
      if (!inOnboarding) {
        router.replace('/onboarding');
      }
      return;
    }

    // Signed in and onboarding is finished
    if (onboardingCompleted === true) {
      if (inAuthentication || inOnboarding) {
        router.replace('/(tabs)');
      }
    }
  }, [
    user,
    authLoading,
    userDocLoading,
    onboardingCompleted,
    segments,
  ]);

  if (authLoading || userDocLoading) {
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