import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import StepScaffold from '../../../src/components/entrySteps/StepScaffold';
import LabeledSlider from '../../../src/components/entrySteps/LabeledSlider';

import { useNewEntry } from '../../../src/context/NewEntryContext';
import { getNextStepRoute } from '../../../src/constants/entrySteps';
import { useJournalingPreferences } from '../../../src/hooks/useJournalingPreferences';
import { useJournalEntries } from '../../../src/hooks/useJournalEntries';

const ENERGY_LABELS = [
  'Exhausted',
  'Low energy',
  'Neutral',
  'Energized',
  'Very energized',
];

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

export default function EnergyStepScreen() {
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
    draft.energy ?? 5,
  );

  const [saving, setSaving] = useState(false);

  const {
    trackingOptions: currentTrackingOptions,
    loading: preferencesLoading,
  } = useJournalingPreferences();

  // New entries use the current journaling settings.
  // Existing entries use the tracking options stored
  // in the draft when editing.
  const trackingOptions =
    draft.trackingOptions ?? currentTrackingOptions;

  const save = async (energyOverride?: number) => {
    if (!draft.mood) {
      Alert.alert(
        'Missing mood',
        "Please go back and select how you're feeling first.",
      );
      return;
    }

    setSaving(true);

    try {
      const energy =
        energyOverride ?? draft.energy;

      if (draft.id) {
        // Editing an existing entry.
        // Keep its original timestamp and tracking options.
        await updateEntry({
          id: draft.id,
          title: draft.title,
          content: draft.content ?? '',
          mood: draft.mood,
          sleepHours: draft.sleepHours,
          physicalActivity: draft.physicalActivity,
          socialInteraction: draft.socialInteraction,
          productivity: draft.productivity,
          screenTime: draft.screenTime,
          stress: draft.stress,
          energy,
          trackingOptions: draft.trackingOptions,
          createdAt:
            draft.createdAt ??
            getEntryCreatedAt(draft.entryDate),
        });
      } else {
        // Creating a new entry.
        // Save the current journaling settings snapshot
        // captured when the entry was started.
        await addEntry({
          title: draft.title,
          content: draft.content ?? '',
          mood: draft.mood,
          sleepHours: draft.sleepHours,
          physicalActivity: draft.physicalActivity,
          socialInteraction: draft.socialInteraction,
          productivity: draft.productivity,
          screenTime: draft.screenTime,
          stress: draft.stress,
          energy,
          trackingOptions: draft.trackingOptions,
          createdAt: getEntryCreatedAt(
            draft.entryDate,
          ),
        });
      }

      resetDraft();
      router.replace('/journal');
    } catch (e) {
      console.error(e);

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
      preferencesLoading &&
      !draft.trackingOptions
    ) {
      return;
    }

    const next = getNextStepRoute(
      'energy',
      trackingOptions,
    );

    if (next) {
      router.push(next);
      return;
    }

    // Energy is the final step.
    // Save without adding an Energy value.
    await save();
  };

  const handleContinue = async () => {
    if (
      preferencesLoading &&
      !draft.trackingOptions
    ) {
      return;
    }

    updateDraft({
      energy: value,
    });

    const next = getNextStepRoute(
      'energy',
      trackingOptions,
    );

    if (next) {
      router.push(next);
      return;
    }

    // Energy is the final step.
    // Pass the current value directly because
    // updateDraft() may not have updated React state yet.
    await save(value);
  };

  return (
    <StepScaffold
      stepKey="energy"
      title="What's your energy level?"
      subtitle="Energy and mood often move together — this helps spot the pattern."
      skippable
      onSkip={handleSkip}
      onContinue={handleContinue}
      continueLabel={
        saving ? 'Saving…' : 'Continue'
      }
      continueDisabled={
        saving ||
        (
          preferencesLoading &&
          !draft.trackingOptions
        )
      }
    >
      <LabeledSlider
        value={value}
        onChange={setValue}
        labels={ENERGY_LABELS}
        minLabel="Exhausted"
        maxLabel="Very energized"
      />
    </StepScaffold>
  );
}