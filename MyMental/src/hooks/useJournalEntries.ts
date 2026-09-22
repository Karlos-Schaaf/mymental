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

export type MoodLevel =
  | 'very_bad'
  | 'bad'
  | 'neutral'
  | 'good'
  | 'great';

export type JournalEntry = {
  id: string;
  title?: string;
  content: string; // Maps to Firestore "body"

  mood?: MoodLevel;
  stress?: number; // 0–10
  energy?: number; // 0–10

  sleepHours?: number; // 0–12
  physicalActivity?: number; // 0–10
  socialInteraction?: number; // 0–10
  productivity?: number; // 0–10
  screenTime?: number; // 0–12 hrs

  createdAt: string; // ISO string for UI use
};

// Mood helpers

export function getMoodColor(mood?: string): string {
  switch (mood as MoodLevel) {
    case 'very_bad':
      return '#F1948A';

    case 'bad':
      return '#F0B27A';

    case 'neutral':
      return '#6b6c61';

    case 'good':
      return '#A9DFBF';

    case 'great':
      return '#0A9B45';

    default:
      return '#EAF8EF';
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
    stress: doc.stress,
    energy: doc.energy,
    sleepHours: doc.sleepHours,
    physicalActivity: doc.physicalActivity,
    socialInteraction: doc.socialInteraction,
    productivity: doc.productivity,
    screenTime: doc.screenTime,
    createdAt,
  };
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const uid = auth.currentUser?.uid;

  // Load entries automatically when the signed-in user changes

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!uid) {
        if (!cancelled) {
          setEntries([]);
          setError(null);
          setLoading(false);
        }

        return;
      }

      try {
        if (!cancelled) {
          setLoading(true);
          setError(null);
        }

        const docs = await getJournalEntries(uid);

        if (!cancelled) {
          setEntries(docs.map(fromFirestore));
        }
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load entries.');
        }

        console.error('useJournalEntries load error:', e);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  // Manually refresh entries

  const loadEntries = useCallback(async () => {
    if (!uid) {
      setEntries([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const docs = await getJournalEntries(uid);
      setEntries(docs.map(fromFirestore));
    } catch (e) {
      setError('Failed to load entries.');
      console.error('useJournalEntries refresh error:', e);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  // Add a new entry — saves to Firestore and updates local state

  const addEntry = async (entry: Omit<JournalEntry, 'id'>) => {
    if (!uid) return;

    try {
      setError(null);

      const id = await saveJournalEntry(uid, {
        title: entry.title,
        body: entry.content,
        mood: entry.mood,
        stress: entry.stress,
        energy: entry.energy,
        sleepHours: entry.sleepHours,
        physicalActivity: entry.physicalActivity,
        socialInteraction: entry.socialInteraction,
        productivity: entry.productivity,
        screenTime: entry.screenTime,
        createdAt: new Date(entry.createdAt),
      });

      const newEntry: JournalEntry = {
        ...entry,
        id,
      };

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
      setError(null);

      await updateJournalEntry(uid, updated.id, {
        title: updated.title,
        body: updated.content,
        mood: updated.mood,
        stress: updated.stress,
        energy: updated.energy,
        sleepHours: updated.sleepHours,
        physicalActivity: updated.physicalActivity,
        socialInteraction: updated.socialInteraction,
        productivity: updated.productivity,
        screenTime: updated.screenTime,
      });

      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === updated.id ? updated : entry,
        ),
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
      setError(null);

      await deleteJournalEntry(uid, id);

      setEntries((prev) =>
        prev.filter((entry) => entry.id !== id),
      );
    } catch (e) {
      setError('Failed to delete entry.');
      console.error('useJournalEntries deleteEntry error:', e);
    }
  };

  // Find an entry by ID

  const getEntry = (id: string) =>
    entries.find((entry) => entry.id === id);

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    refresh: loadEntries,
  };
}