import type { MoodLevel } from '../hooks/useJournalEntries';

// The `moods` array in src/constants/theme.ts is qualitative (label + color)
// with no numeric value. To show an aggregate "Average Mood X/10" on the
// dashboard, we map each label to an approximate score. This is a simple
// heuristic for visualization only — if you'd rather have users rate mood
// numerically (e.g. a 1–10 slider at entry time), store that directly on
// the entry instead and this file becomes unnecessary.

export const MOOD_SCORES: Record<MoodLevel, number> = {
  very_bad: 2,
  bad: 4,
  neutral: 6,
  good: 8,
  great: 10,
};

export function scoreForMood(mood?: MoodLevel): number | null {
  if (!mood) return null;
  return MOOD_SCORES[mood] ?? null;
}
