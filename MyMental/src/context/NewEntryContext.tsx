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

import {
  JournalTrackingOption,
} from '../firebase/firestore';

export type EntryDraft = {
  id?: string;
  entryDate?: string;
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

  // Settings used by this specific entry
  trackingOptions?: JournalTrackingOption[];
};

type NewEntryContextValue = {
  draft: EntryDraft;

  updateDraft: (
    patch: Partial<EntryDraft>
  ) => void;

  startNew: (
    entryDate?: string,
    trackingOptions?: JournalTrackingOption[],
  ) => void;

  startEdit: (
    entry: JournalEntry
  ) => void;

  resetDraft: () => void;
};

const NewEntryContext =
  createContext<NewEntryContextValue | undefined>(
    undefined,
  );

const EMPTY_DRAFT: EntryDraft = {};

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function NewEntryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [draft, setDraft] =
    useState<EntryDraft>(EMPTY_DRAFT);

  const updateDraft = useCallback(
    (patch: Partial<EntryDraft>) => {
      setDraft((previous) => ({
        ...previous,
        ...patch,
      }));
    },
    [],
  );

  // Start a completely new entry using the
  // journaling settings active at that moment.
  const startNew = useCallback(
    (
      entryDate?: string,
      trackingOptions?: JournalTrackingOption[],
    ) => {
      setDraft({
        entryDate,
        trackingOptions: trackingOptions
          ? [...trackingOptions]
          : undefined,
      });
    },
    [],
  );

  // When editing an existing entry, restore the
  // settings that were used when that entry was created.
  const startEdit = useCallback(
    (entry: JournalEntry) => {
      setDraft({
        id: entry.id,

        entryDate: getLocalDateKey(
          new Date(entry.createdAt),
        ),

        createdAt: entry.createdAt,

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

        trackingOptions: entry.trackingOptions
          ? [...entry.trackingOptions]
          : undefined,
      });
    },
    [],
  );

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
  const context = useContext(
    NewEntryContext,
  );

  if (!context) {
    throw new Error(
      'useNewEntry must be used within a NewEntryProvider',
    );
  }

  return context;
}