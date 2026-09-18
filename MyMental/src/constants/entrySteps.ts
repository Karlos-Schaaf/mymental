import type { Href } from 'expo-router';

// Ordered registry for the "log an entry" flow.
// To add a new step later:
//
//   1. Add its config here in the right position.
//   2. Create the route file at the given path.
//   3. Have that screen read/write its slice of the draft via useNewEntry().
//
// Every step screen calls getNextStepRoute(currentKey) rather than
// hardcoding the next screen, so this array is the only place the flow's
// order lives.

export type EntryStepKey = 'mood' | 'stress' | 'energy' | 'write';

export type EntryStepConfig = {
  key: EntryStepKey;
  route: Href;
  skippable: boolean;
};

export const ENTRY_STEPS: EntryStepConfig[] = [
  { key: 'mood', route: '/journal', skippable: false },
  { key: 'stress', route: '/entry/stress', skippable: true },
  { key: 'energy', route: '/entry/energy', skippable: true },
  { key: 'write', route: '/entry/write', skippable: true },
];

export function getNextStepRoute(
  currentKey: EntryStepKey
): Href | null {
  const index = ENTRY_STEPS.findIndex((s) => s.key === currentKey);

  if (index === -1 || index === ENTRY_STEPS.length - 1) {
    return null;
  }

  return ENTRY_STEPS[index + 1].route;
}

export function getStepPosition(currentKey: EntryStepKey) {
  const index = ENTRY_STEPS.findIndex((s) => s.key === currentKey);

  return {
    current: index + 1,
    total: ENTRY_STEPS.length,
  };
}