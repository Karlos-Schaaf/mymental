import { useEntriesStore, JournalEntry, MoodLevel } from '../store/entriesStore';

export type { JournalEntry, MoodLevel };

export const moodLevelMap: Record<string, MoodLevel> = {
  'Very Bad': 'very_bad',
  'Bad': 'bad',
  'Neutral': 'neutral',
  'Good': 'good',
  'Great': 'great',
};

export function getMoodLevel(mood: string): MoodLevel | undefined {
  return moodLevelMap[mood];
}

export function getMoodColor(mood?: string): string {
  const level = moodLevelMap[mood ?? ''] ?? (mood as MoodLevel);
  switch (level) {
    case 'very_bad': return '#F1948A';
    case 'bad':      return '#F0B27A';
    case 'neutral':  return '#F9E79F';
    case 'good':     return '#A9DFBF';
    case 'great':    return '#0A9B45';
    default:         return '#EAF8EF';
  }
}

export function getMoodEmoji(mood?: string): string {
  const level = moodLevelMap[mood ?? ''] ?? (mood as MoodLevel);
  switch (level) {
    case 'very_bad': return '😞';
    case 'bad':      return '😔';
    case 'neutral':  return '😐';
    case 'good':     return '😊';
    case 'great':    return '😁';
    default:         return '📝';
  }
}

export function useJournalEntries() {
  const { entries, addEntry, updateEntry, deleteEntry, getEntry } = useEntriesStore();
  return { entries, addEntry, updateEntry, deleteEntry, getEntry };
}