import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MoodLevel = 'very_bad' | 'bad' | 'neutral' | 'good' | 'great';

export interface JournalEntry {
  id: string;
  content: string;
  date: string;          // ISO string
  mood?: MoodLevel;      // optional until mood feature is ready
  title?: string;        // optional – can be derived later
}

interface EntriesState {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateEntry: (entry: JournalEntry) => void;   // full object (matches how you call it)
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => JournalEntry | undefined;
}

export const useEntriesStore = create<EntriesState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: Date.now().toString(),
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },

      updateEntry: (updated) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === updated.id ? updated : e
          ),
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },

      getEntry: (id) => get().entries.find((e) => e.id === id),
    }),
    {
      name: 'journal-entries',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);