// src/hooks/useJournalEntries.ts
// Journal entries hook — reads and writes to Firebase Firestore
// Entries are stored under users/{uid}/entries/ and tied to the logged-in user

import { useState, useEffect, useCallback } from 'react';
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
  content: string;   // maps to Firestore "body"
  mood?: MoodLevel;
  createdAt: string; // ISO string for UI use
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

// Convert Firestore entry to local JournalEntry shape
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
  };
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const uid = auth.currentUser?.uid;

  // Load entries from Firestore on mount
  const loadEntries = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }
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
    loadEntries();
  }, [loadEntries]);

  // Add a new entry — saves to Firestore and updates local state
  const addEntry = async (entry: Omit<JournalEntry, 'id'>) => {
    if (!uid) return;
    try {
      const id = await saveJournalEntry(uid, {
        title: entry.title,
        body: entry.content,
        mood: entry.mood,
        createdAt: new Date(entry.createdAt),
      });
      const newEntry: JournalEntry = { ...entry, id };
      setEntries((prev) => [newEntry, ...prev]);
    } catch (e) {
      setError('Failed to save entry.');
      console.error('useJournalEntries addEntry error:', e);
    }
  };

  // Update an existing entry — saves to Firestore and updates local state
  const updateEntry = async (updated: JournalEntry) => {
    if (!uid) return;
    try {
      await updateJournalEntry(uid, updated.id, {
        title: updated.title,
        body: updated.content,
        mood: updated.mood,
      });
      setEntries((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e))
      );
    } catch (e) {
      setError('Failed to update entry.');
      console.error('useJournalEntries updateEntry error:', e);
    }
  };

  // Delete an entry — removes from Firestore and updates local state
  const deleteEntry = async (id: string) => {
    if (!uid) return;
    try {
      await deleteJournalEntry(uid, id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      setError('Failed to delete entry.');
      console.error('useJournalEntries deleteEntry error:', e);
    }
  };

  const getEntry = (id: string) => entries.find((e) => e.id === id);

  return { entries, loading, error, addEntry, updateEntry, deleteEntry, getEntry, refresh: loadEntries };
}
