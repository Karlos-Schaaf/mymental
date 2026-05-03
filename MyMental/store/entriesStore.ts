import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: string;
  energy: number; // 1–10
  prompt: string;
  createdAt: string; // ISO string
}

interface EntriesState {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => JournalEntry | undefined;
  getStreak: () => number;
}

export const useEntriesStore = create<EntriesState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },

      getEntry: (id) => {
        return get().entries.find((e) => e.id === id);
      },

      getStreak: () => {
        const { entries } = get();
        if (entries.length === 0) return 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let streak = 0;
        let checkDate = new Date(today);

        while (true) {
          const dateStr = checkDate.toDateString();
          const hasEntry = entries.some(
            (e) => new Date(e.createdAt).toDateString() === dateStr
          );
          if (!hasEntry) break;
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }

        return streak;
      },
    }),
    {
      name: 'journal-entries',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
