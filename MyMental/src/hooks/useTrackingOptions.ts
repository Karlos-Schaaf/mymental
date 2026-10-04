import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { auth } from '../firebase/auth';
import {
  DEFAULT_JOURNALING_OPTIONS,
  getUserDoc,
  JournalTrackingOption,
} from '../firebase/firestore';

/**
 * Loads the user's saved journaling tracking options and
 * re-reads them every time the screen regains focus, so changes
 * made in Journaling Settings show up on return.
 *
 * Applies the same validity rules as the settings screen:
 * at least 3 options, and mood must be included.
 */
export function useTrackingOptions(): JournalTrackingOption[] {
  const [options, setOptions] = useState<JournalTrackingOption[]>(
    DEFAULT_JOURNALING_OPTIONS,
  );

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const load = async () => {
        const user = auth.currentUser;

        if (!user) {
          return;
        }

        try {
          const userDoc = await getUserDoc(user.uid);

          const saved =
            userDoc?.preferences?.journaling?.trackingOptions;

          if (
            !cancelled &&
            Array.isArray(saved) &&
            saved.length >= 3 &&
            saved.includes('mood')
          ) {
            setOptions(saved as JournalTrackingOption[]);
          }
        } catch (error) {
          console.error('Failed to load tracking options:', error);
        }
      };

      load();

      return () => {
        cancelled = true;
      };
    }, []),
  );

  return options;
}