import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import LabeledSlider from '../../../src/components/entrySteps/LabeledSlider';

import { useNewEntry } from '../../../src/context/NewEntryContext';
import { getNextStepRoute } from '../../../src/constants/entrySteps';
import { useJournalingPreferences } from '../../../src/hooks/useJournalingPreferences';
import { useJournalEntries } from '../../../src/hooks/useJournalEntries';

const SCREEN_TIME_LABELS = [
  'Minimal',
  'Light',
  'Moderate',
  'High',
  'Very high',
];

function formatScreenHours(value: number) {
  if (value >= 12) return '12+ hrs';

  return `${value % 1 === 0 ? value : value.toFixed(1)} hrs`;
}

function getEntryCreatedAt(entryDate?: string): string {
  if (!entryDate) {
    return new Date().toISOString();
  }

  const [year, month, day] = entryDate
    .split('-')
    .map(Number);

  const now = new Date();

  const localDate = new Date(
    year,
    month - 1,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );

  return localDate.toISOString();
}

export default function ScreenTimeStepScreen() {
  const {
    draft,
    updateDraft,
    resetDraft,
  } = useNewEntry();

  const {
    addEntry,
    updateEntry,
  } = useJournalEntries();

  const [value, setValue] = useState(
    draft.screenTime ?? 6,
  );

  const [saving, setSaving] = useState(false);

  const {
    trackingOptions: currentTrackingOptions,
    loading: preferencesLoading,
  } = useJournalingPreferences();

  // Existing entries use the settings saved with that entry.
  // New entries use the current settings snapshot.
  const trackingOptions =
    draft.trackingOptions ?? currentTrackingOptions;

  const saveEntry = async (
    screenTimeOverride?: number,
  ) => {
    if (
      (preferencesLoading && !draft.trackingOptions) ||
      saving
    ) {
      return;
    }

    if (!draft.mood) {
      Alert.alert(
        'Missing mood',
        "Please go back and select how you're feeling first.",
      );
      return;
    }

    setSaving(true);

    try {
      const screenTime =
        screenTimeOverride ??
        draft.screenTime;

      if (draft.id) {
        // Editing an existing entry.
        // Keep its original timestamp and tracking options.
        await updateEntry({
          id: draft.id,
          title: draft.title,
          content: draft.content ?? '',
          mood: draft.mood,
          sleepHours: draft.sleepHours,
          physicalActivity:
            draft.physicalActivity,
          socialInteraction:
            draft.socialInteraction,
          productivity:
            draft.productivity,
          screenTime,
          stress: draft.stress,
          energy: draft.energy,
          trackingOptions:
            draft.trackingOptions,
          createdAt:
            draft.createdAt ??
            getEntryCreatedAt(
              draft.entryDate,
            ),
        });
      } else {
        // Creating a new entry.
        // Keep the journaling settings snapshot
        // captured when the entry was started.
        await addEntry({
          title: draft.title,
          content: draft.content ?? '',
          mood: draft.mood,
          sleepHours: draft.sleepHours,
          physicalActivity:
            draft.physicalActivity,
          socialInteraction:
            draft.socialInteraction,
          productivity:
            draft.productivity,
          screenTime,
          stress: draft.stress,
          energy: draft.energy,
          trackingOptions:
            draft.trackingOptions,
          createdAt: getEntryCreatedAt(
            draft.entryDate,
          ),
        });
      }

      resetDraft();
      router.replace('/journal');
    } catch (error) {
      console.error(
        'Failed to save journal entry:',
        error,
      );

      Alert.alert(
        'Error',
        draft.id
          ? 'Could not update your entry. Please try again.'
          : 'Could not save your entry. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    if (
      (preferencesLoading && !draft.trackingOptions) ||
      saving
    ) {
      return;
    }

    const next = getNextStepRoute(
      'screenTime',
      trackingOptions,
    );

    if (next) {
      router.push(next);
      return;
    }

    // Screen Time is the final selected step.
    // Save without adding a Screen Time value.
    await saveEntry();
  };

  const handleContinue = async () => {
    if (
      (preferencesLoading && !draft.trackingOptions) ||
      saving
    ) {
      return;
    }

    // Save the selected Screen Time value into the draft.
    updateDraft({
      screenTime: value,
    });

    const next = getNextStepRoute(
      'screenTime',
      trackingOptions,
    );

    if (next) {
      router.push(next);
      return;
    }

    // Screen Time is the final selected step.
    // Pass the value directly because updateDraft()
    // may not have updated React state yet.
    await saveEntry(value);
  };

  return (
    <StepScaffold
      stepKey="screenTime"
      title="How much screen time did you have?"
      subtitle="Phone, computer, and TV combined — a rough estimate is fine."
      skippable
      onSkip={handleSkip}
      onContinue={handleContinue}
      continueLabel={
        saving ? 'Saving…' : 'Continue'
      }
      continueDisabled={
        (preferencesLoading && !draft.trackingOptions) ||
        saving
      }
    >
      <LabeledSlider
        value={value}
        onChange={setValue}
        min={0}
        max={12}
        step={0.5}
        labels={SCREEN_TIME_LABELS}
        minLabel="0 hrs"
        maxLabel="12+ hrs"
        formatValue={formatScreenHours}
      />
    </StepScaffold>
  );
}