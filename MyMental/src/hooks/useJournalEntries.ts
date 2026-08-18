import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { auth } from '../firebase/auth';
import {
  saveJournalEntry,
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
  FirestoreJournalEntry,
} from '../firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export type MoodLevel = 'very_bad' | 'bad' | 'neutral' | 'good' | 'great';

export type JournalEntry = {
  id: string;
  title?: string;
  content: string;
  mood?: MoodLevel;
  createdAt: string;
  updatedAt: string;
};

// Mood helpers
export function getMoodColor(mood?: string): string {
  switch (mood as MoodLevel) {
    case 'very_bad': return '#F1948A';
    case 'bad':      return '#F0B27A';
    case 'neutral':  return '#F9E79F';
    case 'good':     return '#A9DFBF';
    case 'great':    return '#0A9B45';
    default:         return '#EAF8EF';
  }
}

export function getMoodEmoji(mood?: string): string {
  switch (mood as MoodLevel) {
    case 'very_bad': return '😞';
    case 'bad':      return '😔';
    case 'neutral':  return '😐';
    case 'good':     return '😊';
    case 'great':    return '😁';
    default:         return '📝';
  }
}

function fromFirestore(doc: FirestoreJournalEntry): JournalEntry {
  const createdAt =
    doc.createdAt instanceof Timestamp
      ? doc.createdAt.toDate().toISOString()
      : doc.createdAt instanceof Date
      ? doc.createdAt.toISOString()
      : new Date().toISOString();

    return {
    id: doc.id ?? Date.now().toString(),
    title: doc.title,
    content: doc.body,
    mood: doc.mood as MoodLevel | undefined,
    createdAt,
    updatedAt: createdAt,
  };
}

// Shared Zustand store — all screens read from the same entries list
type JournalStore = {
  entries: JournalEntry[];
  setEntries: (entries: JournalEntry[]) => void;
  upsertEntry: (entry: JournalEntry) => void;
  removeEntry: (id: string) => void;
};

const useJournalStore = create<JournalStore>((set) => ({
  entries: [],
  setEntries: (entries) => set({ entries }),
  upsertEntry: (entry) =>
    set((state) => {
      const exists = state.entries.find((e) => e.id === entry.id);
      if (exists) {
        return { entries: state.entries.map((e) => (e.id === entry.id ? entry : e)) };
      }
      return { entries: [entry, ...state.entries] };
    }),
  removeEntry: (id) =>
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
}));

// Hook used by all journal screens
export function useJournalEntries() {
  const { entries, setEntries, upsertEntry, removeEntry } = useJournalStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uid = auth.currentUser?.uid;

  const loadEntries = useCallback(async () => {
    if (!uid) return;
    try {
      setLoading(true);
      const docs = await getJournalEntries(uid);
      setEntries(docs.map(fromFirestore));
    } catch (e) {
      setError('Failed to load entries.');
      console.error('useJournalEntries load error:', e);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    if (entries.length === 0) loadEntries();
  }, []);

  const addEntry = async (entry: Omit<JournalEntry, 'id'>) => {
    if (!uid) return;
    try {
      const id = await saveJournalEntry(uid, {
        ...(entry.title ? { title: entry.title } : {}),
        body: entry.content,
        ...(entry.mood ? { mood: entry.mood } : {}),
        createdAt: new Date(entry.createdAt),
      });
      const newEntry: JournalEntry = { ...entry, id, updatedAt: new Date().toISOString() };
      upsertEntry(newEntry);
    } catch (e) {
      setError('Failed to save entry.');
      console.error('useJournalEntries addEntry error:', e);
    }
  };

  const updateEntry = async (updated: JournalEntry) => {
    if (!uid) return;
    try {
      await updateJournalEntry(uid, updated.id, {
        title: updated.title,
        body: updated.content,
        mood: updated.mood,
      });
      upsertEntry({ ...updated, updatedAt: new Date().toISOString() });
    } catch (e) {
      setError('Failed to update entry.');
      console.error('useJournalEntries updateEntry error:', e);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!uid) return;
    try {
      await deleteJournalEntry(uid, id);
      removeEntry(id);
    } catch (e) {
      setError('Failed to delete entry.');
      console.error('useJournalEntries deleteEntry error:', e);
    }
  };

  const getEntry = (id: string) => entries.find((e) => e.id === id);

  return { entries, loading, error, addEntry, updateEntry, deleteEntry, getEntry, refresh: loadEntries };
}