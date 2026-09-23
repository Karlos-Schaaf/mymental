import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import {
  JournalEntry,
  MoodLevel,
} from '../hooks/useJournalEntries';

export type EntryDraft = {
  // Present when editing an existing entry.
  // Absent when creating a new entry.
  id?: string;

  // YYYY-MM-DD date selected by the user.
  entryDate?: string;

  // Original timestamp, preserved when editing.
  createdAt?: string;

  mood?: MoodLevel;

  sleepHours?: number;

  physicalActivity?: number;

  socialInteraction?: number;

  productivity?: number;

  screenTime?: number;

  stress?: number;

  energy?: number;

  title?: string;

  content?: string;
};


type NewEntryContextValue = {
  draft: EntryDraft;

  updateDraft: (patch: Partial<EntryDraft>) => void;

  startNew: (entryDate?: string) => void;

  startEdit: (entry: JournalEntry) => void;

  resetDraft: () => void;
};

const NewEntryContext =
  createContext<NewEntryContextValue | undefined>(
    undefined,
  );

const EMPTY_DRAFT: EntryDraft = {};

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    '0',
  );
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function NewEntryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [draft, setDraft] =
    useState<EntryDraft>(EMPTY_DRAFT);

  /**
   * Update one or more values in the current entry flow.
   */
  const updateDraft = useCallback(
    (patch: Partial<EntryDraft>) => {
      setDraft((previous) => ({
        ...previous,
        ...patch,
      }));
    },
    [],
  );

  /**
   * Start a completely new journal entry.
   *
   * No id means this entry will eventually be created
   * with addEntry().
   */
  const startNew = useCallback(
    (entryDate?: string) => {
      setDraft({
        entryDate,
      });
    },
    [],
  );

  /**
   * Start editing an existing journal entry.
   *
   * Keeping the existing id means the final save can
   * call updateEntry() instead of creating a new entry.
   */
  const startEdit = useCallback(
    (entry: JournalEntry) => {
      setDraft({
        id: entry.id,

        entryDate: getLocalDateKey(
          new Date(entry.createdAt),
        ),

        mood: entry.mood,
        sleepHours: entry.sleepHours,
        physicalActivity: entry.physicalActivity,
        socialInteraction: entry.socialInteraction,
        productivity: entry.productivity,
        screenTime: entry.screenTime,
        stress: entry.stress,
        energy: entry.energy,

        title: entry.title,
        content: entry.content,
      });
    },
    [],
  );

  /**
   * Completely clear the current entry flow.
   *
   * Used after saving, cancelling, or closing the flow.
   */
  const resetDraft = useCallback(() => {
    setDraft(EMPTY_DRAFT);
  }, []);

  return (
    <NewEntryContext.Provider
      value={{
        draft,
        updateDraft,
        startNew,
        startEdit,
        resetDraft,
      }}
    >
      {children}
    </NewEntryContext.Provider>
  );
}

export function useNewEntry() {
  const context = useContext(NewEntryContext);

  if (!context) {
    throw new Error(
      'useNewEntry must be used within a NewEntryProvider',
    );
  }

  return context;
}