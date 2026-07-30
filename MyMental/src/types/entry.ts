export type Entry = {
  id: string;
  title: string;
  body: string;
  mood: string;
  energy: number;
  prompt?: string;
  createdAt: Date;
};