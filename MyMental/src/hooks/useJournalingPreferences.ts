import { useEffect, useState } from 'react';

import { auth } from '../firebase/auth';

import {
  DEFAULT_JOURNALING_OPTIONS,
  getUserDoc,
  JournalTrackingOption,
} from '../firebase/firestore';

export function useJournalingPreferences() {
  const [trackingOptions, setTrackingOptions] =
    useState<JournalTrackingOption[]>(
      DEFAULT_JOURNALING_OPTIONS,
    );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPreferences = async () => {
      const user = auth.currentUser;

      if (!user) {
        if (!cancelled) {
          setTrackingOptions(DEFAULT_JOURNALING_OPTIONS);
          setLoading(false);
        }

        return;
      }

      try {
        const userDoc = await getUserDoc(user.uid);

        const savedOptions =
          userDoc?.preferences?.journaling?.trackingOptions;

        if (cancelled) {
          return;
        }

        if (
          Array.isArray(savedOptions) &&
          savedOptions.length > 0 &&
          savedOptions.includes('mood')
        ) {
          setTrackingOptions(
            savedOptions as JournalTrackingOption[],
          );
        } else {
          setTrackingOptions(DEFAULT_JOURNALING_OPTIONS);
        }

        setError(null);
      } catch (err) {
        console.error(
          'Failed to load journaling preferences:',
          err,
        );

        if (!cancelled) {
          setError(
            'Your journaling preferences could not be loaded.',
          );

          setTrackingOptions(
            DEFAULT_JOURNALING_OPTIONS,
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPreferences();

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    const user = auth.currentUser;

    if (!user) {
      setTrackingOptions(DEFAULT_JOURNALING_OPTIONS);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userDoc = await getUserDoc(user.uid);

      const savedOptions =
        userDoc?.preferences?.journaling?.trackingOptions;

      if (
        Array.isArray(savedOptions) &&
        savedOptions.length > 0 &&
        savedOptions.includes('mood')
      ) {
        setTrackingOptions(
          savedOptions as JournalTrackingOption[],
        );
      } else {
        setTrackingOptions(
          DEFAULT_JOURNALING_OPTIONS,
        );
      }
    } catch (err) {
      console.error(
        'Failed to refresh journaling preferences:',
        err,
      );

      setError(
        'Your journaling preferences could not be loaded.',
      );

      setTrackingOptions(
        DEFAULT_JOURNALING_OPTIONS,
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    trackingOptions,
    loading,
    error,
    refresh,
  };
}