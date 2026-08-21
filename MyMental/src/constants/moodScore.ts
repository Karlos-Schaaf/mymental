// The `moods` array in src/constants/theme.ts is qualitative (label + color)
// with no numeric value. To show an aggregate "Average Mood X/10" on the
// dashboard, we map each label to an approximate score. This is a simple
// heuristic for visualization only — if you'd rather have users rate mood
// numerically (e.g. a 1–10 slider at entry time), store that directly on
// the entry instead and this file becomes unnecessary.

export const MOOD_SCORES: Record<string, number> = {
  Joyful: 9,
  Hopeful: 8,
  Grateful: 8,
  Energised: 8,
  Calm: 7,
  Tired: 4,
  Anxious: 3,
  Sad: 2,
};

export function scoreForMood(mood: string): number | null {
  return mood in MOOD_SCORES ? MOOD_SCORES[mood] : null;
}
