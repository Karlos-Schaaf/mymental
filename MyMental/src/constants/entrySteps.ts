import { Href } from 'expo-router';

// Ordered registry for the "log an entry" flow.

export type EntryStepKey =
  | 'mood'
  | 'sleep'
  | 'activity'
  | 'social'
  | 'productivity'
  | 'screenTime'
  | 'stress'
  | 'energy'
  | 'write';

export type EntryStepConfig = {
  key: EntryStepKey;
  route: Href;
  skippable: boolean;
};

export const ENTRY_STEPS: EntryStepConfig[] = [
  { key: 'mood', route: '/entry/mood', skippable: false },
  { key: 'sleep', route: '/entry/sleep', skippable: true },
  { key: 'activity', route: '/entry/activity', skippable: true },
  { key: 'social', route: '/entry/social', skippable: true },
  { key: 'productivity', route: '/entry/productivity', skippable: true },
  { key: 'screenTime', route: '/entry/screen-time', skippable: true },
  { key: 'stress', route: '/entry/stress', skippable: true },
  { key: 'energy', route: '/entry/energy', skippable: true },
  { key: 'write', route: '/entry/write', skippable: true },
];

export function getNextStepRoute(
  currentKey: EntryStepKey,
): Href | null {
  const index = ENTRY_STEPS.findIndex(
    (s) => s.key === currentKey,
  );

  if (
    index === -1 ||
    index === ENTRY_STEPS.length - 1
  ) {
    return null;
  }

  return ENTRY_STEPS[index + 1].route;
}

export function getStepPosition(
  currentKey: EntryStepKey,
) {
  const index = ENTRY_STEPS.findIndex(
    (s) => s.key === currentKey,
  );

  return {
    current: index + 1,
    total: ENTRY_STEPS.length,
  };
}

export function getPreviousStepRoute(
  currentKey: EntryStepKey,
): Href | null {
  const index = ENTRY_STEPS.findIndex(
    (s) => s.key === currentKey,
  );

  if (index <= 0) {
    return null;
  }

  return ENTRY_STEPS[index - 1].route;
}