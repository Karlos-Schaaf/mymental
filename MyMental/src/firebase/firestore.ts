import { 
  getFirestore,
  collection,
  addDoc
} from "firebase/firestore";
import { Entry } from "../types/entry";

import app from "./config";

const db = getFirestore(app);

export async function createEntry(entry: Omit<Entry, "id">) {
  return await addDoc(
    collection(db, "entries"),
    entry
  );
}