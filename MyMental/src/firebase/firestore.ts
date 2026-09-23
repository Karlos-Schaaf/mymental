// src/firebase/firestore.ts
// Firestore functions for journal entries and user documents
// Journal entries are stored under users/{uid}/entries/{entryId}

import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

import { db } from "./config";

// Firestore's addDoc/updateDoc reject any field whose value is literally
// `undefined` (as opposed to the field being absent). Optional fields on
// FirestoreJournalEntry (title, mood, stress, energy, prompt) can easily
// end up `undefined` when a step in the entry flow is skipped, so we strip
// those keys out entirely before writing rather than requiring every call
// site to remember to omit them.
function omitUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

// ---------- Journal Entries (user-scoped) ----------

export type FirestoreJournalEntry = {
  id?: string;
  title?: string;
  body: string;
  mood?: string;
  energy?: number;
  stress?: number;
  sleepHours?: number;
  physicalActivity?: number;
  socialInteraction?: number;
  productivity?: number;
  screenTime?: number;
  prompt?: string;
  createdAt: Timestamp | Date;
};

// Save a new journal entry for a user
export async function saveJournalEntry(
  uid: string,
  entry: Omit<FirestoreJournalEntry, "id">
) {
  const payload = omitUndefined({
    ...entry,
    createdAt: Timestamp.fromDate(
      entry.createdAt instanceof Date ? entry.createdAt : new Date()
    ),
  });

  const ref = await addDoc(collection(db, "users", uid, "entries"), payload);
  return ref.id;
}

// Get all journal entries for a user, ordered by newest first
export async function getJournalEntries(uid: string): Promise<FirestoreJournalEntry[]> {
  const q = query(
    collection(db, "users", uid, "entries"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FirestoreJournalEntry[];
}

// Update an existing journal entry
export async function updateJournalEntry(
  uid: string,
  entryId: string,
  updates: Partial<Omit<FirestoreJournalEntry, "id">>
) {
  await updateDoc(doc(db, "users", uid, "entries", entryId), omitUndefined(updates));
}

// Delete a journal entry
export async function deleteJournalEntry(uid: string, entryId: string) {
  await deleteDoc(doc(db, "users", uid, "entries", entryId));
}

// ---------- User document (users/{uid}) ----------

export type NotificationPrefs = {
  dailyReminder: boolean;
  streakReminder: boolean;
  weeklyInsights: boolean;
  resourceUpdates: boolean;
};

export type JournalTrackingOption =
  | 'mood'
  | 'energy'
  | 'stress'
  | 'journal'
  | 'sleep'
  | 'productivity'
  | 'physicalActivity'
  | 'socialInteraction'
  | 'screenTime';

export type JournalingPrefs = {
  trackingOptions: JournalTrackingOption[];
};

export const DEFAULT_JOURNALING_OPTIONS: JournalTrackingOption[] = [
  'mood',
  'stress',
  'journal',
];

export async function getUserDoc(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export function subscribeToUserDoc(
  uid: string,
  callback: (data: any | null) => void
) {
  return onSnapshot(doc(db, 'users', uid), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null);
  });
}

export async function updateUserDisplayName(uid: string, displayName: string) {
  await setDoc(
    doc(db, "users", uid),
    { profile: { displayName } },
    { merge: true }
  );
}

export async function updateNotificationPrefs(
  uid: string,
  prefs: NotificationPrefs
) {
  await setDoc(
    doc(db, "users", uid),
    { preferences: { notifications: prefs } },
    { merge: true }
  );
}

export async function updateJournalingPrefs(
  uid: string,
  trackingOptions: JournalTrackingOption[]
) {
  await setDoc(
    doc(db, 'users', uid),
    {
      preferences: {
        journaling: {
          trackingOptions,
        },
      },
    },
    { merge: true }
  );
}

export async function startOnboarding(uid: string) {
  await setDoc(
    doc(db, 'users', uid),
    {
      onboardingCompleted: false,
    },
    { merge: true }
  );
}

export async function completeOnboarding(uid: string) {
  await setDoc(
    doc(db, 'users', uid),
    {
      onboardingCompleted: true,
    },
    { merge: true }
  );
}

export async function deleteUserDoc(uid: string) {
  await deleteDoc(doc(db, "users", uid));
}
