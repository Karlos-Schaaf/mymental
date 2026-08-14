import { useCallback, useEffect, useState } from 'react';
import { FirestoreError } from 'firebase/firestore';

import { auth } from '../firebase/auth';
import { getUserEntries } from '../firebase/firestore';
import { Entry } from '../types/entry';

export type JournalEntriesState = {
  /** null while the first load is in flight; [] once loaded with no data */
  entries: Entry[] | null;
  loading: boolean;
  refreshing: boolean;
  /** Human-readable message when the hook is NOT operational, else null */
  error: string | null;
  refresh: () => Promise<void>;
};

function messageForError(err: unknown): string {
  const code = (err as FirestoreError)?.code;

  switch (code) {
    case 'permission-denied':
      // Firestore rules rejected the read — usually a rules bug or a
      // userId mismatch on the entry documents.
      return "You don't have permission to view these entries.";
    case 'failed-precondition':
      // Almost always a missing composite index for
      // where("userId","==",uid) + orderBy("createdAt","desc").
      // Firestore's own error includes a console link to create it.
      return 'This feature needs a one-time setup on the backend. Check the console for a Firestore index link, then try again.';
    case 'unavailable':
    case 'deadline-exceeded':
      return "Couldn't reach the server. Check your connection and try again.";
    case 'unauthenticated':
      return 'Your session expired. Please log in again.';
    default:
      return "Couldn't load your journal entries. Please try again.";
  }
}

export function useJournalEntries(max = 60): JournalEntriesState {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(
    async (isRefresh: boolean) => {
      const user = auth.currentUser;

      // NOT OPERATIONAL: no signed-in user. This can happen briefly during
      // sign-out (the screen may still be mounted for a frame) or if this
      // hook is ever used outside an authenticated route.
      if (!user) {
        setEntries(null);
        setError('You need to be signed in to see your journal entries.');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        setError(null);
        const data = await getUserEntries(user.uid, max);
        setEntries(data);
      } catch (err) {
        // NOT OPERATIONAL: the query itself failed. Keep any entries we
        // already had (e.g. a failed pull-to-refresh shouldn't blank the
        // screen), and surface a specific message where we can.
        console.error('useJournalEntries failed:', err);
        if (!isRefresh) setEntries((prev) => prev ?? []);
        setError(messageForError(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [max],
  );

  useEffect(() => {
    setLoading(true);
    fetchEntries(false);
    // Re-run if the signed-in user changes (e.g. logs out and a different
    // account logs in without a full app reload).
  }, [fetchEntries]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEntries(true);
  }, [fetchEntries]);

  return { entries, loading, refreshing, error, refresh };
}
