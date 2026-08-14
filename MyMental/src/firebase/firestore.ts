import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

import { Entry } from "../types/entry";
import { db } from "./config";

// ---------- Entries ----------

export async function createEntry(entry: Omit<Entry, "id">) {
  return await addDoc(collection(db, "entries"), entry);
}

export async function getUserEntries(uid: string, max = 60): Promise<Entry[]> {
  const entriesQuery = query(
    collection(db, "entries"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
    limit(max),
  );

  const snap = await getDocs(entriesQuery);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Entry));
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
    { merge: true },
  );
}

export async function updateNotificationPrefs(
  uid: string,
  prefs: NotificationPrefs,
) {
  await setDoc(
    doc(db, "users", uid),
    { preferences: { notifications: prefs } },
    { merge: true },
  );
}

export async function deleteUserDoc(uid: string) {
  await deleteDoc(doc(db, "users", uid));
}