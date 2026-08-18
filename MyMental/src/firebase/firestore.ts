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
  Timestamp,
} from "firebase/firestore";

import { Entry } from "../types/entry";
import { db } from "./config";

// ---------- Journal Entries (user-scoped) ----------

export type FirestoreJournalEntry = {
  id?: string;
  title?: string;
  body: string;
  mood?: string;
  energy?: number;
  prompt?: string;
  createdAt: Timestamp | Date;
};

// Save a new journal entry for a user
export async function saveJournalEntry(
  uid: string,
  entry: Omit<FirestoreJournalEntry, "id">
) {
  const ref = await addDoc(
    collection(db, "users", uid, "entries"),
    {
      ...entry,
      createdAt: Timestamp.fromDate(
        entry.createdAt instanceof Date ? entry.createdAt : new Date()
      ),
      updatedAt: new Date(),
    }
  );
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
  await updateDoc(doc(db, "users", uid, "entries", entryId), {
    ...updates,
    updatedAt: new Date(),
  });
}

// Delete a journal entry
export async function deleteJournalEntry(uid: string, entryId: string) {
  await deleteDoc(doc(db, "users", uid, "entries", entryId));
}

// ---------- Entries (legacy — kept for compatibility) ----------

export async function createEntry(entry: Omit<Entry, "id">) {
  return await addDoc(collection(db, "entries"), entry);
}

// ---------- User document (users/{uid}) ----------

export type NotificationPrefs = {
  dailyReminder: boolean;
  streakReminder: boolean;
  weeklyInsights: boolean;
  resourceUpdates: boolean;
};

export async function getUserDoc(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
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

export async function deleteUserDoc(uid: string) {
  await deleteDoc(doc(db, "users", uid));
}
