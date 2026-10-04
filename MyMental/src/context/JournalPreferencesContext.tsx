import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { auth } from '../firebase/auth';

import {
  DEFAULT_JOURNALING_OPTIONS,
  subscribeToUserDoc,
  JournalTrackingOption,
} from '../firebase/firestore';

type JournalingPreferencesContextValue = {
  trackingOptions: JournalTrackingOption[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const JournalingPreferencesContext =
  createContext<JournalingPreferencesContextValue | undefined>(
    undefined,
  );

function isValidTrackingOption(
  value: unknown,
): value is JournalTrackingOption {
  return (
    value === 'mood' ||
    value === 'energy' ||
    value === 'stress' ||
    value === 'journal' ||
    value === 'sleep' ||
    value === 'productivity' ||
    value === 'physicalActivity' ||
    value === 'socialInteraction' ||
    value === 'screenTime'
  );
}

function getValidTrackingOptions(
  value: unknown,
): JournalTrackingOption[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const validOptions = value.filter(
    isValidTrackingOption,
  );

  if (
    validOptions.length < 3 ||
    !validOptions.includes('mood')
  ) {
    return null;
  }

  return validOptions;
}

export function JournalingPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [trackingOptions, setTrackingOptions] =
    useState<JournalTrackingOption[]>(
      DEFAULT_JOURNALING_OPTIONS,
    );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;

    // No synchronous setState here.
    // If there is no user, the initial state is already correct.
    if (!user) {
      return;
    }

    const unsubscribe = subscribeToUserDoc(
      user.uid,
      (userDoc) => {
        const savedOptions =
          userDoc?.preferences?.journaling?.trackingOptions;

        const validOptions =
          getValidTrackingOptions(savedOptions);

        if (validOptions) {
          console.log(
            'JOURNALING PREFERENCES UPDATED:',
            validOptions,
          );

          setTrackingOptions(validOptions);
        } else {
          console.log(
            'USING DEFAULT JOURNALING PREFERENCES:',
            DEFAULT_JOURNALING_OPTIONS,
          );

          setTrackingOptions(
            DEFAULT_JOURNALING_OPTIONS,
          );
        }

        setError(null);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const refresh = async () => {
    // The Firestore onSnapshot listener automatically
    // receives changes, so no manual refresh is required.
  };

  return (
    <JournalingPreferencesContext.Provider
      value={{
        trackingOptions,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </JournalingPreferencesContext.Provider>
  );
}

export function useJournalingPreferences() {
  const context = useContext(
    JournalingPreferencesContext,
  );

  if (!context) {
    throw new Error(
      'useJournalingPreferences must be used within a JournalingPreferencesProvider',
    );
  }

  return context;
}