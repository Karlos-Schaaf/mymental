import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { MoodLevel } from '../hooks/useJournalEntries';

export type EntryDraft = {
  mood?: MoodLevel;
  stress?: number; // 0–10
  energy?: number; // 0–10
  title?: string;
  content?: string;
};

type NewEntryContextValue = {
  draft: EntryDraft;
  updateDraft: (patch: Partial<EntryDraft>) => void;
  resetDraft: () => void;
};

const NewEntryContext = createContext<NewEntryContextValue | undefined>(
  undefined,
);

const EMPTY_DRAFT: EntryDraft = {};

export function NewEntryProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<EntryDraft>(EMPTY_DRAFT);

  const updateDraft = useCallback((patch: Partial<EntryDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraft(EMPTY_DRAFT), []);

  return (
    <NewEntryContext.Provider value={{ draft, updateDraft, resetDraft }}>
      {children}
    </NewEntryContext.Provider>
  );
}

export function useNewEntry() {
  const ctx = useContext(NewEntryContext);
  if (!ctx) {
    throw new Error('useNewEntry must be used within a NewEntryProvider');
  }
  return ctx;
}
