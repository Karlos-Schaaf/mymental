import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "../src/firebase/auth";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/authentication/login");
      }
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="authentication/login" />
      <Stack.Screen name="authentication/signup" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}