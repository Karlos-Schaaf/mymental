import type { Timestamp } from 'firebase/firestore';

export type MoodLevel =
  | 'very_bad'
  | 'bad'
  | 'neutral'
  | 'good'
  | 'great';

export type Entry = {
  id: string;
  userId: string;
  title: string;
  body: string;
  mood: MoodLevel;
  stress?: number;
  prompt?: string;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
};