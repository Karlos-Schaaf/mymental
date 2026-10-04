import { Href } from 'expo-router';
import { JournalTrackingOption } from '../firebase/firestore';

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
  {
    key: 'mood',
    route: '/entry/mood',
    skippable: false,
  },
  {
    key: 'sleep',
    route: '/entry/sleep',
    skippable: true,
  },
  {
    key: 'activity',
    route: '/entry/activity',
    skippable: true,
  },
  {
    key: 'social',
    route: '/entry/social',
    skippable: true,
  },
  {
    key: 'productivity',
    route: '/entry/productivity',
    skippable: true,
  },
  {
    key: 'screenTime',
    route: '/entry/screen-time',
    skippable: true,
  },
  {
    key: 'stress',
    route: '/entry/stress',
    skippable: true,
  },
  {
    key: 'energy',
    route: '/entry/energy',
    skippable: true,
  },
  {
    key: 'write',
    route: '/entry/write',
    skippable: true,
  },
];

const TRACKING_OPTION_TO_STEP: Partial<
  Record<JournalTrackingOption, EntryStepKey>
> = {
  mood: 'mood',
  sleep: 'sleep',
  physicalActivity: 'activity',
  socialInteraction: 'social',
  productivity: 'productivity',
  screenTime: 'screenTime',
  stress: 'stress',
  energy: 'energy',
  journal: 'write',
};

export function getEntrySteps(
  trackingOptions: JournalTrackingOption[],
): EntryStepConfig[] {
  const selectedSteps = new Set<EntryStepKey>();

  for (const option of trackingOptions) {
    const step = TRACKING_OPTION_TO_STEP[option];

    if (step) {
      selectedSteps.add(step);
    }
  }

  // Mood is always required.
  selectedSteps.add('mood');

  return ENTRY_STEPS.filter((step) =>
    selectedSteps.has(step.key),
  );
}

export function getNextStepRoute(
  currentKey: EntryStepKey,
  trackingOptions: JournalTrackingOption[],
): Href | null {
  const steps = getEntrySteps(trackingOptions);

  const index = steps.findIndex(
    (step) => step.key === currentKey,
  );

  if (index === -1 || index === steps.length - 1) {
    return null;
  }

  return steps[index + 1].route;
}

export function getStepPosition(
  currentKey: EntryStepKey,
  trackingOptions: JournalTrackingOption[],
) {
  const steps = getEntrySteps(trackingOptions);

  const index = steps.findIndex(
    (step) => step.key === currentKey,
  );

  return {
    current: index + 1,
    total: steps.length,
  };
}

export function getPreviousStepRoute(
  currentKey: EntryStepKey,
  trackingOptions: JournalTrackingOption[],
): Href | null {
  const steps = getEntrySteps(trackingOptions);

  const index = steps.findIndex(
    (step) => step.key === currentKey,
  );

  if (index <= 0) {
    return null;
  }

  return steps[index - 1].route;
}